-- TRIGGERS

CREATE OR REPLACE TRIGGER configs_seed_tg
BEFORE INSERT ON user_configs FOR EACH ROW
DECLARE
BEGIN
    :new.random_seed := configs_seed_seq.nextval;
END;

/
CREATE OR REPLACE TRIGGER users_avatar_tg
BEFORE INSERT ON users FOR EACH ROW
DECLARE
BEGIN
    :new.avatar_id := users_avatar_seq.nextval;
END;

/

CREATE OR REPLACE TRIGGER poll_answers_integrity_tg
BEFORE INSERT ON POLL_ANSWERS FOR EACH ROW
DECLARE
    v_count NUMBER := 0; 
BEGIN
    SELECT COUNT(*) INTO v_count from POLL_ANSWERS WHERE POLL_ID=:new.POLL_ID;
    if v_count >= 10 then
        raise_application_error(-20001, 'Too many poll answers');
    end if;
END;

/
CREATE OR REPLACE TRIGGER message_reactions_integrity_tg
BEFORE INSERT ON MESSAGE_REACTIONS FOR EACH ROW
DECLARE
    v_member_id message_reactions.member_id%TYPE := :new.member_id;
    v_message_id message_reactions.message_id%TYPE := :new.message_id;
    v_count NUMBER := 0;
BEGIN
    SELECT count(*) INTO v_count 
    FROM room_members me 
    INNER JOIN chat_messages msg ON (msg.id=v_message_id) 
    INNER JOIN room_members me2 ON (me2.id=msg.member_id)
    WHERE me2.room_id=me.room_id AND me.id=v_member_id;
    if v_count = 0 then
        raise_application_error(-20001, 'Chat member ID and message ID do not match');
    end if;
END;

/

CREATE OR REPLACE TRIGGER chat_room_integrity_tg
BEFORE INSERT OR UPDATE ON CHAT_ROOMS FOR EACH ROW
DECLARE
    v_count NUMBER;
BEGIN
    IF :new.type = 'GROUP' THEN
        SELECT COUNT(g.id) INTO v_count FROM CHAT_GROUPS g WHERE g.room_id=:new.id;
        IF v_count = 0 THEN
            raise_application_error(-20404, 'No group data connected to the room');
        END IF;
    END IF;
    
END;

/

CREATE OR REPLACE FUNCTION GET_ROOM_NAME(r_id chat_rooms.id%TYPE, my_id room_members.id%TYPE)
RETURN varchar
AS
    v_name VARCHAR(255) := NULL;
    v_type chat_rooms.type%TYPE := NULL;
    v_first_name users.first_name%TYPE := NULL;
    v_last_name users.last_name%TYPE := NULL;
BEGIN
    SELECT custom_display_name INTO v_name
    FROM chat_rooms
    WHERE id = r_id;
    if v_name IS NOT NULL then
        RETURN v_name;
    end if;
    SELECT type INTO v_type
    FROM chat_rooms
    WHERE id=r_id;
    if v_type = 'DIRECT' then
        SELECT u.first_name, u.last_name INTO v_first_name, v_Last_name
        FROM room_members rm 
        INNER JOIN users u ON (rm.user_id = u.id)
        WHERE rm.id != my_id AND rm.room_id = r_id
        FETCH FIRST 1 ROWS ONLY;
        RETURN v_first_name || ' ' || v_last_name;   
    end if;
EXCEPTION
    WHEN others THEN
        RETURN NULL;
END;

/

create OR REPLACE FUNCTION GET_ROOM_AVATAR(r_id chat_rooms.id%TYPE, my_id room_members.id%TYPE)
    RETURN NUMBER
AS
    v_avatar_id NUMBER := 0;
BEGIN
    SELECT u.avatar_id INTO v_avatar_id
    FROM room_members rm
             INNER JOIN chat_rooms r ON(r.id=r_id AND r.type='DIRECT')
             INNER JOIN users u ON (rm.user_id = u.id)
    WHERE rm.id != my_id AND rm.room_id = r.id;
    RETURN v_avatar_id;
EXCEPTION
    WHEN others THEN
        RETURN 0;
END;
/




create or replace procedure leave_chat (p_member_id room_members.id%type)
as
	v_count_users number := 0;
    v_new_admin_id number := 0;
    v_room_id number := 0;
begin
    Update room_members set left_at = SYSDATE() where id = p_member_id;
	SELECT room_id INTO v_room_id
    FROM room_members
    WHERE id = p_member_id;
    SELECT count(*) INTO v_count_users
    FROM room_members
    WHERE left_at IS NULL and permissions = 'ADMIN' and id != p_member_id;
	IF v_count_users < 1 then
		SELECT id INTO v_new_admin_id
        FROM room_members
        WHERE left_at IS NULL and room_id = v_room_id
        ORDER BY joined_at DESC 
        FETCH FIRST 1 ROWS ONLY;
        UPDATE room_members
        SET permissions='ADMIN'
        WHERE id=v_new_admin_id;
    end if;
EXCEPTION
    WHEN no_data_found THEN
        raise_application_error(-20003, 'No user can take admin privilages');
	WHEN others THEN
        raise_application_error(-20001, 'Something went horribly wrong');
end;

/


CREATE OR REPLACE PROCEDURE GET_USER_ROOM_DATA_SIMPLE(user_id NUMBER, out_cur OUT SYS_REFCURSOR)
IS
BEGIN

    OPEN out_cur FOR 
        SELECT RAWTOHEX(room.public_id) as public_id, GET_ROOM_NAME(room.id, me.id) AS chat_name, 
                room.type as type, me.permissions as permissions, COUNT_UNREAD(room.id, me.last_read) as unread,
                grp.join_code as join_code
        FROM 
        ROOM_MEMBERS me
            INNER JOIN CHAT_ROOMS room ON (room.id=me.room_id)
            LEFT JOIN CHAT_GROUPS grp ON (grp.room_id=room.id)
        WHERE me.user_id=user_id and me.left_at IS NULL;
            
END;
/

create or replace function COUNT_UNREAD (p_room_id NUMBER, p_last_read TIMESTAMP)
return number
as
    v_unread number := 0;
begin

    select count(m.id) into v_unread
    from chat_messages m inner join room_members me on (me.id=m.member_id AND me.room_id=p_room_id)
    where m.sent_at > p_last_read;
    
    return v_unread;
EXCEPTION
    WHEN others THEN
        RETURN 0;
end;

/


create OR REPLACE PROCEDURE GET_USER_ROOM_DATA(v_user_id NUMBER, out_cur OUT SYS_REFCURSOR)
    IS
    -- Returns a list of rooms for the current user with relevant information about the last messages
-- Single-query procedure mainly for the java-backend
BEGIN
    OPEN out_cur FOR
        WITH messages AS
                 (
                     SELECT me1.room_id as room_id, m.id, m.content, m.sent_at, s.nickname, (s.first_name || ' ' || s.last_name) as name,
                            ROW_NUMBER() OVER(PARTITION BY me1.room_id ORDER BY m.sent_at DESC) AS rk
                     FROM ROOM_MEMBERS me1
                              INNER JOIN CHAT_MESSAGES m ON (m.member_id=me1.id)
                              INNER JOIN USERS s ON (s.id=me1.user_id)
                 ) -- sub-query to help select the last message in a channel

        SELECT RAWTOHEX(room.public_id) as public_id, GET_ROOM_NAME(room.id, me.id) AS chat_name,
               room.type as type, me.permissions as permissions, COUNT_UNREAD(room.id, me.last_read) as unread,
               grp.join_code as join_code, NVL(msg.id,0) as msg_id, msg.content as msg_content, NVL(msg.sent_at,me.last_read) as msg_sent_at,
               msg.nickname as msg_nickname, msg.name as msg_name, (CASE WHEN room.TYPE='DIRECT' THEN GET_ROOM_AVATAR(room.ID,me.id) ELSE 0 END) as msg_avatar_id
        FROM
            ROOM_MEMBERS me
                INNER JOIN CHAT_ROOMS room ON (room.id=me.room_id)
                LEFT JOIN CHAT_GROUPS grp ON (grp.room_id=room.id)
                LEFT JOIN messages msg ON (room.id=msg.room_id AND msg.rk=1)
        WHERE me.user_id=v_user_id and me.left_at IS NULL;

END;
/




CREATE OR REPLACE TRIGGER chat_messages_integrity_tg
BEFORE INSERT OR UPDATE ON CHAT_MESSAGES FOR EACH ROW
DECLARE
    v_poll_id polls.id%TYPE := NULL;
    v_author_id polls.author_id%TYPE := NULL;
    v_user_id users.id%TYPE := NULL;
    v_left_at room_members.left_at%TYPE := NULL;
    v_permissions room_members.permissions%TYPE := NULL;
BEGIN
	SELECT left_at, permissions INTO v_left_at, v_permissions
    FROM room_members
    WHERE id = :new.member_id;
    if v_left_at IS NOT NULL then
        raise_application_error(-20001, 'User not in the chat');
    end if;
		
    if v_permissions = 'READONLY' then
        raise_application_error(-20001, 'Permission denied');
    end if;
	
    if :new.poll_id IS NOT NULL then
        v_poll_id := :new.poll_id;
		
        SELECT author_id INTO v_author_id 
        FROM polls
        WHERE id = v_poll_id;
		
        SELECT user_id INTO v_user_id
        FROM room_members
        WHERE :new.member_id = id;
		
        if v_user_id != v_author_id then
            raise_application_error(-20001, 'User is not an author of this poll');
        end if;
    end if;
END;



/

CREATE OR REPLACE PROCEDURE JOIN_CHAT(out_member_id OUT NUMBER, p_user_id NUMBER, p_room_id NUMBER, p_perms VARCHAR2)
IS
    v_left_at   ROOM_MEMBERS.left_at%TYPE;
    v_member_id ROOM_MEMBERS.id%TYPE;
    v_room_type CHAT_ROOMS.type%TYPE;
    v_count     NUMBER := 0;
    CURSOR c_member IS 
        SELECT me.id, me.left_at
        FROM ROOM_MEMBERS me WHERE me.user_id=p_user_id AND me.room_id=p_room_id;
    CURSOR c_room IS
        SELECT room.type, COUNT_ACTIVE_MEMBERS(room.id) AS members FROM CHAT_ROOMS room WHERE room.id=p_room_id;
    
BEGIN
    OPEN c_room;
    FETCH c_room INTO v_room_type, v_count;
    IF c_room%notfound THEN
        CLOSE c_room;
        raise_application_error(-20404, 'Not found');
    END IF;
    CLOSE c_room;
    IF (v_room_type = 'DIRECT' AND v_count >= 2) OR v_count >= 100 THEN
        raise_application_error(-20400, 'Room is full');
    END IF;
    
    
    OPEN c_member;
    FETCH c_member INTO v_member_id, v_left_at;
    IF c_member%notfound THEN
        CLOSE c_member; -- in case the INSERT fails
        INSERT INTO ROOM_MEMBERS(permissions, room_id, user_id) VALUES (p_perms, p_room_id, p_user_id) RETURNING id into v_member_id;
    ELSE
        CLOSE c_member;
        IF v_left_at IS NOT NULL THEN
            UPDATE ROOM_MEMBERS me SET me.left_at=NULL WHERE me.id=v_member_id;
        END IF;
    END IF;
    out_member_id := v_member_id;
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        raise_application_error(-20404, 'Not found');
END;

/



CREATE OR REPLACE PROCEDURE CREATE_DIRECT_CHAT(out_room_id OUT NUMBER, p_u1_id NUMBER, p_u2_id NUMBER)
IS
    v_room_id CHAT_ROOMS.id%TYPE;
    v_count     NUMBER := 0;
    v_temp      NUMBER;
    v_perms   ROOM_MEMBERS.permissions%TYPE := NULL;
    CURSOR c_room IS 
        SELECT room.id FROM CHAT_ROOMS room 
            INNER JOIN ROOM_MEMBERS m1 ON (room.id=m1.room_id AND m1.user_id=p_u1_id)
            INNER JOIN ROOM_MEMBERS m2 ON (room.id=m2.room_id AND m2.user_id=p_u2_id)
        WHERE room.type = 'DIRECT';
BEGIN
    SAVEPOINT sp;
    
    SELECT COUNT(id) INTO v_count FROM USERS u WHERE u.id IN (p_u1_id, p_u2_id);
    IF v_count != 2 THEN
        raise_application_error(-20404, 'Users not found');
    END IF;

    OPEN c_room;
    FETCH c_room INTO v_room_id; 
    
    IF c_room%notfound THEN
        CLOSE c_room; -- in case the INSERT fails
        -- Create the room
        INSERT INTO CHAT_ROOMS(type) VALUES('DIRECT') RETURNING id INTO v_room_id;
        JOIN_CHAT(v_temp, p_u1_id, v_room_id, v_perms);
        JOIN_CHAT(v_temp, p_u2_id, v_room_id, v_perms);
    ELSE
        CLOSE c_room;
        out_room_id := v_room_id;
        raise_application_error(-20304, 'Chat room already exists');
    END IF;
    
    
    out_room_id := v_room_id;
    
EXCEPTION
    WHEN others THEN
        ROLLBACK TO sp;
        RAISE;
END;


/

CREATE OR REPLACE PROCEDURE CREATE_GROUP_CHAT(out_room_id OUT NUMBER, p_user_id NUMBER, p_name VARCHAR2)
IS
    v_room_id CHAT_ROOMS.id%TYPE;
    v_count     NUMBER := 0;
    v_code_len  NUMBER := 8;
    v_temp      NUMBER;
    v_perms   ROOM_MEMBERS.permissions%TYPE := 'ADMIN';
BEGIN
    SAVEPOINT sp;
    
    INSERT INTO CHAT_ROOMS(type, custom_display_name) VALUES('DIRECT', p_name) RETURNING id INTO v_room_id;
    INSERT INTO CHAT_GROUPS(room_id, join_code) VALUES(v_room_id, LOWER(DBMS_RANDOM.string('X', v_code_len)));
                                                                    -- practically 36^8 codes, collisions quite improbable
    UPDATE CHAT_ROOMS SET type='GROUP' WHERE id=v_room_id;
    
    JOIN_CHAT(v_temp, p_user_id, v_room_id, v_perms);
    
    out_room_id := v_room_id;
    
EXCEPTION
    WHEN others THEN
        ROLLBACK TO sp;
        RAISE;
END;
/


CREATE OR REPLACE PROCEDURE REACT_TO_MESSAGE(p_member_id room_members.id%TYPE, p_msg_id chat_messages.id%TYPE, p_em_id emojis.id%TYPe)
AS
    v_count NUMBER := 0;
BEGIN
    SELECT count(*) INTO v_count
    FROM message_reactions
    WHERE member_id=p_member_id AND message_id = p_msg_id;
    
    if v_count > 0 then
        UPDATE message_reactions
        SET emoji_id = p_em_id
        WHERE member_id = p_member_id AND message_id = p_msg_id;
    else
        INSERT INTO message_reactions (message_id, member_id, emoji_id)
        VALUES (p_msg_id, p_member_id, p_em_id);
    end if;
END;

/
CREATE OR REPLACE FUNCTION COUNT_ACTIVE_MEMBERS(r_id chat_rooms.id%TYPE)
RETURN NUMBER
AS
    v_count_active_users NUMBER := 0;
BEGIN
    SELECT count(*) INTO v_count_active_users
    FROM room_members
    WHERE room_id = r_id AND left_at IS NULL;
    RETURN v_count_active_users;
END;

/

CREATE OR REPLACE PROCEDURE CLEANUP_TOKENS
AS
BEGIN
   DELETE FROM user_access_tokens
   WHERE (trunc(created_at) + interval '7' day) < to_date(sysdate);
END;