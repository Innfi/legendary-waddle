use actix_web::HttpResponse;
use sqlx::mysql::MySqlPoolOptions;

// FIXME: the return type is ugly as hell, to be divided
pub async fn db_test() -> Result<HttpResponse, sqlx::Error> {
  let pool = MySqlPoolOptions::new()
    .max_connections(2)
    .connect("mysql://tester:test1234@localhost/innfi").await?;

  let row: (i64,) = sqlx::query_as("SELECT id FROM Users")
    .fetch_one(&pool).await?;

  println!("row: {}", row.0);

  Ok(HttpResponse::Ok().finish())
}