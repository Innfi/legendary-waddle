use actix_web::{get, patch, post, web::{self, *}, HttpResponse};
use sqlx::MySqlPool;

use super::{service::{insert_one, select_many, select_one, update_one}, UpdateUserPayload, User};

#[get("/one")]
pub async fn get_user(pool: web::Data<MySqlPool>) -> HttpResponse {
  println!("get_user");
  let _ = select_one(pool).await;

  HttpResponse::Ok().finish()
}

#[get("/many")]
pub async fn get_users(pool: web::Data<MySqlPool>) -> HttpResponse {
  let select_many_result = select_many(pool).await;
  if select_many_result.is_err() {
    println!("err: {:?}", select_many_result.err());

    return HttpResponse::InternalServerError().finish();
  }

  let result = select_many_result.unwrap();
  result.iter().for_each(|x| {
    println!("user: {}, {}, {}", x.id, x.email, x.created_at);
  });

  HttpResponse::Ok().finish()
}

#[post("/")]
pub async fn create_user(pool: web::Data<MySqlPool>, payload: web::Data<User>) -> HttpResponse {
  println!("create_user");

  let result = insert_one(pool, payload).await;
  if result.is_err() {
    println!("err: {:?}", result.err());

    return HttpResponse::InternalServerError().finish();
  }

  HttpResponse::Ok().finish()
}

#[patch("/")]
pub async fn update_user(pool: web::Data<MySqlPool>, payload: web::Data<UpdateUserPayload>) -> HttpResponse {
  println!("update_user");

  let result = update_one(pool, payload).await;
  if result.is_err() {
    return HttpResponse::InternalServerError().finish();
  }

  HttpResponse::Ok().finish()
}

pub fn config_user(cfg: &mut web::ServiceConfig) {
  cfg.service(
    scope("/user")
      .service(get_user)
      .service(get_users)
      .service(create_user)
      .service(update_user),
  );
}