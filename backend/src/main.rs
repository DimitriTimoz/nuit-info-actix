use ::config::Config;
use config::ServerConfig;
use dotenvy::dotenv;
use pg_migrator::PostgresMigrator;

use crate::prelude::*;

pub mod database;
pub mod prelude;
pub mod config;
pub mod errors;
pub mod models;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}


async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let config_ = Config::builder()
        .add_source(::config::Environment::default())
        .build()
        .unwrap();

    let config: ServerConfig = config_.try_deserialize().unwrap();

    let pool = config.pg.create_pool(None, NoTls).unwrap();

    let mut client = pool.get().await.unwrap();
   // PostgresMigrator::new("./migrations")
   //    .migrate(&mut client)
   //     .await
   //     .unwrap();

    let server = HttpServer::new(move|| {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(hello)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(("0.0.0.0", 8000))?
    .run();
    println!("Server running at http://localhost:8000/");

    server.await
}
