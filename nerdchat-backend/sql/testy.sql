CREATE OR REPLACE PROCEDURE thanos_snap_x2
AS
BEGIN
    execute immediate 'truncate table poll_votes cascade';
    execute immediate 'truncate table poll_answers cascade';
    execute immediate 'truncate table message_reactions cascade';
    execute immediate 'truncate table message_attachments cascade';
    execute immediate 'truncate table chat_messages cascade';
    execute immediate 'truncate table uploaded_files cascade';
    execute immediate 'truncate table room_members cascade';
    execute immediate 'truncate table polls cascade';
    execute immediate 'truncate table chat_groups cascade';
    execute immediate 'truncate table emojis cascade';
    execute immediate 'truncate table chat_rooms cascade';
    execute immediate 'truncate table user_access_tokens cascade'; 
    execute immediate 'truncate table user_configs cascade';
    execute immediate 'truncate table user_credentials cascade'; 
    execute immediate 'truncate table users cascade';  
END;
/

--- testy
--- config_seed_trigger_test
-- checks if sequence is working properly in the user_configs table
exec thanos_snap_x2;
DECLARE
    v_id number := 0;
BEGIN
    insert into users (first_name, last_name, nickname) values ('Jan', 'Chrzan', 'test14') RETURNING id INTO v_id;
    INSERT INTO user_configs (accents_color, background_color, font_size_multiplier, show_notifications, text_color_main, text_color_user, random_seed, user_id)
    VALUES ('#ffffff', '#ffffff', 1, 1, '#ffffff', '#ffffff', 0, v_id);
END;
/
--- poll answer integrity trigger test 
exec thanos_snap_x2;
DECLARE
    v_id number := 0;
    v_user_id number := 0;
BEGIN
    insert into users (first_name, last_name, nickname) values ('Marcin', 'Chrzan', 'mandolina1') RETURNING id INTO v_user_id;
    insert into polls (question_text, is_multichoice, created_at, expires_at, author_id) values ('Be?', 0, SYSDATE, (sysdate + Interval '7' DAY), v_user_id) RETURNING id INTO v_id;
    FOR i IN 1000..1011 LOOP
        insert into poll_answers (answer_text, poll_id) values (('Option' || i), v_id);
    END loop;
    raise_application_error(-111, 'Should fail - more than 10 answers');
EXCEPTION
    WHEN others THEN
        IF SQLCODE = -111 OR SQLCODE NOT BETWEEN -21000 AND -20000 THEN
            RAISE;
        END IF;
END;
/
-- tests if there aren't more users in the chat than necessary
exec thanos_snap_x2;
DECLARE
    v_room_id number := 0;
    v_member_id number := 0;
    v_id number := 0;
BEGIN
    insert into users (first_name, last_name, nickname) values ('Marcin', 'Chrzan', 'mandolina1') RETURNING id INTO v_id;
    create_group_chat(v_room_id, v_id, 'test234');
    FOR i IN 1010..1111 LOOP
        insert into users (first_name, last_name, nickname) values ('Marcin', 'Chrzan', 'mandolina' || i) RETURNING id INTO v_id;
        join_chat(v_member_id, v_id, v_room_id, NULL);
    END LOOP;
    raise_application_error(-111, 'Should fail - more than 100 group members');
EXCEPTION
    WHEN others THEN
        IF SQLCODE = -111 OR SQLCODE NOT BETWEEN -21000 AND -20000 THEN
            RAISE;
        END IF;
END;
/
-- tests correct behaviour when admin leaves the group chat
exec thanos_snap_x2;
DECLARE
    v_room_id number := 0;
    v_id number := 0;
    v_member_id number := 0;
BEGIN
    insert into users (first_name, last_name, nickname) values ('Marcin', 'Chrzan', 'mandolina7') RETURNING id INTO v_id;
    create_group_chat(v_room_id, v_id, 'test42');
    insert into users (first_name, last_name, nickname) values ('Marcin', 'Chrzan', 'mandolina8') RETURNING id INTO v_id;
    join_chat(v_member_id, v_id, v_room_id, NULL);
    SELECT id INTO v_member_id
    FROM room_members
    WHERE room_id=v_room_id AND permissions='ADMIN'
    ORDER BY joined_at DESC FETCH FIRST 1 ROWS ONLY;
    leave_chat(v_member_id);
    
    SELECT id INTO v_member_id
    FROM room_members
    WHERE room_id=v_room_id AND permissions='ADMIN' AND left_at IS NOT NULL;
    -- throws an error if the other user didn't get admin privileges
END;

/
--- message reaction integrity trigger test
exec thanos_snap_x2;

DECLARE
BEGIN
    INSERT INTO emojis (id, data_text, label) VALUES (1001, '❤️', 'heart');
    
    INSERT INTO chat_rooms (id, type) VALUES (1002, 'DIRECT');
    INSERT INTO chat_rooms (id, type) VALUES (1003, 'DIRECT');
    
    INSERT INTO users (id, nickname, first_name, last_name) VALUES(1000, 'kowal', 'Adam', 'Kowalski');
    INSERT INTO users (id, nickname, first_name, last_name) VALUES(1001, 'lepszykowal', 'Robert', 'Malysz'); 
    
    INSERT INTO room_members (id, room_id, user_id) VALUES (1003, 1002, 1000);
    INSERT INTO room_members (id, room_id, user_id) VALUES (1005, 1003, 1001);
    
    INSERT INTO chat_messages (id, content, member_id) VALUES (1004, 'abecadlo', 1003);
    INSERT INTO chat_messages (id, content, member_id) VALUES (1006, 'abecadlo12', 1005);
    
    INSERT INTO message_reactions (id, message_id, member_id, emoji_id) VALUES (1004, 1006, 1003, 1001);
    raise_application_error(-111, 'Should fail - differing room ids');
EXCEPTION
    WHEN others THEN
        IF SQLCODE = -111 OR SQLCODE NOT BETWEEN -21000 AND -20000 THEN
            RAISE;
        END IF;
END;
/
-- chat_room_integrity trigger test
exec thanos_snap_x2;
DECLARE
BEGIN
    INSERT INTO chat_rooms (id, type) VALUES (1001, 'GROUP');
    raise_application_error(-111, 'Should fail - no group data');
EXCEPTION
    WHEN others THEN
        IF SQLCODE = -111 OR SQLCODE NOT BETWEEN -21000 AND -20000 THEN
            RAISE;
        END IF;
END;

/
-- chat_messages_integrity trigger test
exec thanos_snap_x2;
DECLARE
    v_id number := 0;
    v_room_id number := 0;
    v_member_id number := 0;
    v_old_user_id number := 0;
    v_poll_id number := 0;
BEGIN
    insert into users (first_name, last_name, nickname) values ('Marcin', 'Chrzan', 'mandolina1') RETURNING id INTO v_id;
    v_old_user_id := v_id;
    create_group_chat(v_room_id, v_id, 'test1');
    insert into users (first_name, last_name, nickname) values ('Zbigniew', 'Musztarda', 'mandolina2') RETURNING id INTO v_id;
    join_chat(v_member_id, v_id, v_room_id, 'READONLY');
    -- INSERT INTO chat_messages (content, member_id) VALUES ('Keczup', v_member_id);
    -- triggers one exception (user does not have persmissions to send messages)
    insert into users (first_name, last_name, nickname) values ('Tomasz', 'Patataj', 'mandolina3') RETURNING id INTO v_id;
    join_chat(v_member_id, v_id, v_room_id, NULL);
    leave_chat(v_member_id);
    --INSERT INTO chat_messages (content, member_id) VALUES ('Sos czosnkowy', v_member_id);
    -- triggers second exception (user left the chat earlier)
    insert into users (first_name, last_name, nickname) values ('Milosz', 'Szmata', 'mandolina4') RETURNING id INTO v_id;
    join_chat(v_member_id, v_id, v_room_id, NULL);
    INSERT INTO polls (question_text, is_multichoice, author_id) VALUES ('To be or not to be?', 0, v_old_user_id) RETURNING id INTO v_poll_id;
    --INSERT INTO chat_messages (content, member_id, poll_id) VALUES ('IDK', v_member_id, v_poll_id);
    -- triggers third exception (poll does not belong to the user)
END;

/
