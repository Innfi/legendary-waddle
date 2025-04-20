use actix_web::web;
use sqlx::MySqlPool;

use super::{UpdateUserPayload, User};

pub async fn select_one(pool: web::Data<MySqlPool>) -> Result<(), sqlx::Error> {
  println!("select_one");
  println!("call_select] pool created");
  let query_result = sqlx::query!("SELECT id FROM users")
    .fetch_one(pool.get_ref())
    .await?;

  println!("row: {:?}", query_result);

  pool.close().await;

  Ok(())
}

pub async fn select_many(pool: web::Data<MySqlPool>) -> Result<Vec<User>, sqlx::Error> {
  println!("select_many");

  let dummy_email = "innfi@test.com";
  let stream = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = ?")
    .bind(dummy_email)
    .fetch_all(pool.get_ref())
    .await;
  if stream.is_err() {
    return Err(stream.err().unwrap());
  }

  pool.close().await;

  Ok(stream.unwrap())
}

pub async fn insert_one(
  pool: web::Data<MySqlPool>,
  payload: web::Data<User>,
) -> Result<(), sqlx::Error> {
  // TODO: grab insert error
  let _ = sqlx::query("INSERT INTO users(email, pass) VALUES(?, ?);")
    .bind(payload.email.clone())
    .bind(payload.pass.clone())
    .execute(pool.get_ref())
    .await;

  Ok(())
}

pub async fn update_one(
  pool: web::Data<MySqlPool>,
  payload: web::Data<UpdateUserPayload>,
) -> Result<(), sqlx::Error> {
  let _ = sqlx::query!(
    "UPDATE users SET 
      email = COALESCE(?, email),
      pass = COALESCE(?, pass) 
     WHERE id = ?",
    payload.email,
    payload.pass,
    payload.id
  )
  .execute(pool.get_ref())
  .await;

  Ok(())
}
