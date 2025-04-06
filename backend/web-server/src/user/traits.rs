
pub trait UserTrait {
  async fn select_one(email: String) -> Result<User, Error>; 
  async fn select_many(emails: Vec<String>) -> Result<Vec<User>, Error>;
}

pub struct UserService {

}