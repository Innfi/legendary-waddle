use chrono::{DateTime, Utc};

#[derive(sqlx::FromRow)]
pub struct User {
  pub id: i32,
  pub email: String,
  pub pass: Option<String>, // just an example for nullable field
  pub created_at: DateTime<Utc>,
}

pub struct UpdateUserPayload {
  pub id: i32,
  pub email: Option<String>,
  pub pass: Option<String>,
}
