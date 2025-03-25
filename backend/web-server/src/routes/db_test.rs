use actix_web::HttpResponse;
use sqlx::mysql::MySqlPoolOptions;
use chrono::{DateTime, Utc};

#[derive(sqlx::FromRow)]
struct User {
  id: i32,
  email: String,
  pass: Option<String>, // just an example for nullable field
  created_at: DateTime<Utc>,
}

// FIXME: the return type is ugly as hell, to be divided
pub async fn call_select_one() -> HttpResponse {
  println!("db_test");
  let _ = select_one().await;

  HttpResponse::Ok().finish()
}

async fn select_one() -> Result<(), sqlx::Error> {
  println!("select_one");

  // FIXME: borrow the pool from the outside
  let pool = MySqlPoolOptions::new()
    .max_connections(2)
    .connect("mysql://tester:test1234@localhost/innfi")
    .await?;

  println!("call_select] pool created");
  let query_result = sqlx::query!("SELECT id FROM users")
    .fetch_one(&pool)
    .await?;

  println!("row: {:?}", query_result);

  pool.close().await;

  Ok(())
}

pub async fn call_select_many() -> HttpResponse {
  let select_many_result = select_many().await;
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

async fn select_many() -> Result<Vec<User>, sqlx::Error> {
  println!("select_many");

  let dummy_email = "innfi@test.com";

  let pool = MySqlPoolOptions::new()
    .max_connections(2)
    .connect("mysql://tester:test1234@localhost/innfi")
    .await?;

  println!("select_many 1");
  let stream = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = ?")
    .bind(dummy_email)
    .fetch_all(&pool).await;
  if stream.is_err() {
    return Err(stream.err().unwrap());
  }

  pool.close().await;

  Ok(stream.unwrap())
}
