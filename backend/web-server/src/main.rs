use dotenv::dotenv;
use std::env;

use web_server::startup_web::run_v2;
use web_server::common;


#[tokio::main]
async fn main() -> std::io::Result<()> {
  dotenv().ok();
  print_env();
  println!("Hello, world!");

  let common_resource = common::init_common_resource();

  run_v2(common_resource)?.await
}

fn print_env() {
  let process_env = env::vars().find(|x| x.0 == "PROCESS_ENV");
  if process_env.is_none() {
    return;
  }
  if process_env.unwrap().1 != "local" {
    return;
  }

  for (key, value) in env::vars() {
    println!("{}: {}", key, value);
  }
}
