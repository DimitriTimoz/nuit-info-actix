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
pub mod cors;
pub mod game;

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
    
    while let Err(e) = pool.get().await {
        println!("Error connecting to database: {}", e);
        println!("Retrying in 5 seconds...");
        std::thread::sleep(std::time::Duration::from_secs(5));
    } 
    PostgresMigrator::new("./migrations")
       .migrate(&mut pool.get().await.unwrap())
        .await
        .unwrap();

    let server = HttpServer::new(move|| {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(actix_web::middleware::DefaultHeaders::new().add(("Access-Control-Allow-Origin", "*")))
            .service(cors::cors_preflight)
            .service(hello)
            .service(game::get_measure)
            .service(game::create_game)
            .service(game::get_game)
            .service(game::accept)
            .service(game::reject)
            .service(game::forty_nine_three)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(("127.0.0.1", 8000))?
    .run();
    println!("Server running at http://localhost:8000/");

    server.await
}
