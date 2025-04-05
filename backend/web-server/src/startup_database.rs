use actix_web::web;
use sqlx::mysql::MySqlPoolOptions;
use sqlx::MySqlPool;

pub fn init_database_pool() -> web::Data<MySqlPool> {
  let pool = MySqlPoolOptions::new()
    .max_connections(2)
    .connect_lazy("mysql://tester:test1234@localhost/innfi")
    .expect("failed to connect to database");

  return web::Data::new(pool);
}