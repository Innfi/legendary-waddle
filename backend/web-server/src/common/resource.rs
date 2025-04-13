use std::sync::Arc;

use sqlx::{mysql::MySqlPoolOptions, MySqlPool};

pub struct CommonResource {
  pub pool: MySqlPool,
}

pub fn init_common_resource() -> Arc<CommonResource > {
  Arc::new(CommonResource { 
    pool: MySqlPoolOptions::new()
    .max_connections(2)
    .connect_lazy("mysql://tester:test1234@localhost/innfi")
    .expect("failed to connect to database"),
  })
}