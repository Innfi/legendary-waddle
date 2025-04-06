use std::sync::Arc;

use chrono::{DateTime, Utc};
use sqlx::MySqlPool;

#[derive(sqlx::FromRow)]
pub struct UserEntity {
  id: i32,
  email: String,
  pass: Option<String>, // just an example for nullable field
  created_at: DateTime<Utc>,
}
pub struct UserRepo {
  pool: Arc<MySqlPool>,
}

impl UserRepo {
  pub fn new(db_pool: Arc<MySqlPool>) -> UserRepo {
    UserRepo {
      pool: db_pool,
    }
  }

  pub async fn select_one(&self, email: String) -> Result<UserEntity, sqlx::Error> {
    println!("UserRepo.select_one] email: {}", email);

    let query_result = sqlx::query_as::<_, UserEntity>("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .fetch_one(self.pool.as_ref())
      .await;

    if query_result.is_err() {

    }

    Ok(query_result.unwrap())
  }
}
