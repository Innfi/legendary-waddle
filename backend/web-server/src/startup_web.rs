use std::net::TcpListener;
use std::sync::Arc;
use actix_web::dev::Server;
use actix_web::{App, HttpServer, web};
use sqlx::MySqlPool;

use crate::common::CommonResource;
use crate::routes::{call_insert_one, call_select_many, call_select_one, health_check};

pub fn run(listener: TcpListener, pool: web::Data<MySqlPool>) -> Result<Server, std::io::Error> {
  let server = HttpServer::new(move || {
    App::new()
      .route("/health_check", web::get().to(health_check))
      .route("/select/one", web::get().to(call_select_one))
      .route("/select/many", web::get().to(call_select_many))
      .route("/user", web::post().to(call_insert_one))
      .app_data(pool.clone())
  })
  .listen(listener)?
  .run();

  Ok(server)
}


pub fn run_v2(common_resource: Arc<CommonResource>) -> Result<Server, std::io::Error> {
  let server = HttpServer::new(move || {
    App::new()
      .route("/health_check", web::get().to(health_check))
      .route("/select/one", web::get().to(call_select_one))
      .route("/select/many", web::get().to(call_select_many))
      .route("/user", web::post().to(call_insert_one))
      .app_data(web::Data::new(common_resource.clone()))
  })
  .bind(("127.0.0.1", 8080))?
  .run();

  Ok(server)
}
