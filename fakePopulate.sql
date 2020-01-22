USE foredb;

INSERT INTO ideas (title, content, like_count, parent_id, owner)
VALUES ('example text', 'example textexample textexample text ', 3, null, 'anonim');

INSERT INTO ideas (title, content, like_count, parent_id, owner)
VALUES ('example text', 'example textexample textexample le textexample le textexample le textexample text ', 2, null, 'anonim');

INSERT INTO ideas (title, content, like_count, parent_id, owner)
VALUES ('example text', 'le textexample le textexample le textexample le textexample le textexample example textexample textexample text ', 5, null, 'dincer');

INSERT INTO ideas (title, content, like_count, parent_id, owner)
VALUES ('example text', 'example textexample le textexample le textexample le textexample le textexample le textexample le textexample textexample text ', 6, 1, 'dincer');

INSERT INTO ideas (title, content, like_count, parent_id, owner)
VALUES ('example text', 'le textexample le textexample le textexample example textexample textexample text ', 3, 2, 'dincer');

INSERT INTO ideas (title, content, like_count, parent_id, owner)
VALUES ('example text', 'example textexample textexample le textexample text ', 4, 1, 'dincer');

INSERT INTO ideas (title, content, like_count, parent_id, owner)
VALUES ('example text', 'example textexample le textexample le textexample textexample text ', 1, 2, 'dincer');

INSERT INTO ideas (title, content, like_count, parent_id, owner)
VALUES ('example text', 'example textexample textexample text ', 0, null, 'dincer');
