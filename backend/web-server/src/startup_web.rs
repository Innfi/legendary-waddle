use std::sync::Arc;
use actix_web::dev::Server;
use actix_web::{App, HttpServer, web};

use crate::common::CommonResource;
use crate::routes::health_check;
use crate::user::config_user;

pub fn run_v2(common_resource: Arc<CommonResource>) -> Result<Server, std::io::Error> {
  let server = HttpServer::new(move || {
    App::new()
      .configure(config_user)
      .route("/health_check", web::get().to(health_check))
      .app_data(web::Data::new(common_resource.clone()))
  })
  .bind(("127.0.0.1", 8080))?
  .run();

  Ok(server)
}
