use tokio_postgres::{NoTls, Client, Error};

pub struct Database {
    pub client: Client,
}

impl Database {
    pub async fn async_new() -> Result<Self, Error> {
        let (client, connection) =
            tokio_postgres::connect("host=localhost user=postgres", NoTls).await?;

        tokio::spawn(async move {
            if let Err(e) = connection.await {
                eprintln!("connection error: {}", e);
            }
        });

        Ok(Self { client })
    }

    pub fn new() -> Result<Self, Error> {
        tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .unwrap()
        .block_on(async {
            Database::async_new().await
        })    
    }
}

lazy_static::lazy_static! {
    pub static ref DB: Database =  Database::new().unwrap();
}
