from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData
from sqlalchemy.sql import insert

CONN_STRING = "postgresql://postgres:example@127.0.0.1:3306/kursach"

class DBProcessor:
    def __init__(self, conn_string):
        self.engine = create_engine(conn_string)
        self.meta = MetaData()
        users = Table(
            'users', self.meta, 
            Column('id', Integer, primary_key = True), 
            Column('login', String, unique=True),
            Column('password', String),
        )

        self.meta.create_all(self.engine)

    def check_if_user_exists(self, login, password):
        res = self.engine.execute("select * from users where login = \'%s\' and password = \'%s\'"%(login, password))
        results = res.fetchall()
        if res.rowcount == 0:
            return False
        else:
            print(results[0].id, results[0].login, results[0].password)
            return True

    def check_if_name_unique(self, login):
        res = self.engine.execute("select * from users where login = \'%s\'"%(login))
        results = res.fetchall()
        if res.rowcount == 0:
            return True
        return False

    def add_new_user(self, login, password):
        if not self.check_if_name_unique(login):
            return False
        users = Table('users', self.meta, autoload_with=self.engine)
        stmt = (
            insert(users).
            values(login=login, password=password))
        self.engine.execute(stmt) 
        return True
        

# db = DBProcessor(CONN_STRING)
# db.create_table_users()
# db.add_new_user('admin', '123')
# db.check_if_user_exists('admin', '123')