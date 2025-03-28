use actix_web::{web, HttpResponse};
use sqlx::MySqlPool;
use chrono::{DateTime, Utc};

#[derive(sqlx::FromRow)]
struct User {
  id: i32,
  email: String,
  pass: Option<String>, // just an example for nullable field
  created_at: DateTime<Utc>,
}

// FIXME: the return type is ugly as hell, to be divided
pub async fn call_select_one(pool: web::Data<MySqlPool>) -> HttpResponse {
  println!("db_test");
  let _ = select_one(pool).await;

  HttpResponse::Ok().finish()
}

async fn select_one(pool: web::Data<MySqlPool>) -> Result<(), sqlx::Error> {
  println!("select_one");
  println!("call_select] pool created");
  let query_result = sqlx::query!("SELECT id FROM users")
    .fetch_one(pool.get_ref())
    .await?;

  println!("row: {:?}", query_result);

  pool.close().await;

  Ok(())
}

pub async fn call_select_many(pool: web::Data<MySqlPool>) -> HttpResponse {
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

async fn select_many(pool: web::Data<MySqlPool>) -> Result<Vec<User>, sqlx::Error> {
  println!("select_many");

  let dummy_email = "innfi@test.com";
  let stream = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = ?")
    .bind(dummy_email)
    .fetch_all(pool.get_ref()).await;
  if stream.is_err() {
    return Err(stream.err().unwrap());
  }

  pool.close().await;

  Ok(stream.unwrap())
}
