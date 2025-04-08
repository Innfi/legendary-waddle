use actix_web::{web, HttpResponse, Responder};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct GetUserRequest {
  email: String,
}

pub struct UserService {}
impl UserService {
  pub fn get_user(&self, payload: web::Query<GetUserRequest>) -> impl Responder{
    println!("payload: {}", payload.email);

    format!("test {}", payload.email)
  }
}