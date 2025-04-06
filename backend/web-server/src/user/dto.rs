pub struct CreateUserPayload {
  id: i32,
  email: String,
  pass: Option<String>, // just an example for nullable field
  created_at: DateTime<Utc>,
}

pub struct UpdateUserPayload {
  id: i32,
  email: Option<String>,
  pass: Option<String>,
}
