use actix_web::HttpResponse;
use sqlx::mysql::MySqlPoolOptions;

// FIXME: the return type is ugly as hell, to be divided
pub async fn db_test() -> HttpResponse {
  println!("db_test");
  let _ = call_select().await;

  HttpResponse::Ok().finish()
}

async fn call_select() -> Result<(), sqlx::Error> {
  println!("call_select");
  let pool = MySqlPoolOptions::new()
    .max_connections(2)
    .connect("mysql://tester:test1234@localhost/innfi")
    .await?;

  println!("call_select] pool created");
  let query_result = sqlx::query!("SELECT id FROM users")
    .fetch_one(&pool)
    .await?;

  println!("row: {:?}", query_result);

  Ok(())
}
