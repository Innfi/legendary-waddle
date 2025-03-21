use actix_web::dev::Server;
use actix_web::{App, HttpServer, web};
use std::net::TcpListener;

use web_server::routes::{db_test, health_check};

fn run(listener: TcpListener) -> Result<Server, std::io::Error> {
  let server = HttpServer::new(move || {
    App::new()
      .route("/health_check", web::get().to(health_check))
      .route("/db", web::get().to(db_test))
  })
  .listen(listener)?
  .run();

  Ok(server)
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
  println!("Hello, world!");

  let listener = TcpListener::bind("localhost:8080")?;

  run(listener)?.await
}
