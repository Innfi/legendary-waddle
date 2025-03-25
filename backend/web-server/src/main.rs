use actix_web::dev::Server;
use actix_web::{App, HttpServer, web};
use dotenv::dotenv;
use std::env;
use std::net::TcpListener;

use web_server::routes::{call_select_many, call_select_one, health_check};

fn run(listener: TcpListener) -> Result<Server, std::io::Error> {
  let server = HttpServer::new(move || {
    App::new()
      .route("/health_check", web::get().to(health_check))
      .route("/select/one", web::get().to(call_select_one))
      .route("/select/many", web::get().to(call_select_many))
  })
  .listen(listener)?
  .run();

  Ok(server)
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
  dotenv().ok();
  print_env();
  println!("Hello, world!");

  let listener = TcpListener::bind("localhost:8080")?;

  run(listener)?.await
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
