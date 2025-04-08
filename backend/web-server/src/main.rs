use actix_web::dev::Server;
use actix_web::{App, HttpServer, web};
use sqlx::mysql::MySqlPoolOptions;
use sqlx::MySqlPool;
use dotenv::dotenv;
use std::env;
use std::net::TcpListener;

use web_server::startup_database::init_database_pool;
use web_server::startup_web::run;
use web_server::routes::{call_insert_one, call_select_many, call_select_one, health_check};
use web_server::user::UserService;

#[tokio::main]
async fn main() -> std::io::Result<()> {
  dotenv().ok();
  print_env();
  println!("Hello, world!");

  let pool = init_database_pool();
  let listener = TcpListener::bind("localhost:8080")?;
  let user_service = web::Data::new(UserService{});

  run(listener, user_service, pool)?.await
}

fn print_env() {
  let process_env = env::vars().find(|x| x.0 == "PROCESS_ENV");
  if process_env.is_none() {
    return;
  }
  if process_env.unwrap().1 != "local" {
    return;
  }

  for (key, value) in env::vars() {
    println!("{}: {}", key, value);
  }
}
