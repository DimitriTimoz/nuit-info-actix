use tokio_postgres::{NoTls, Client};

pub struct Database {
    pub client: Client,
}

impl Default for Database {
    fn default() -> Self {
        let client = futures::executor::block_on(async {
            let (client, connection) = tokio_postgres::connect("host=localhost user=user password=password", NoTls).await.unwrap();
            tokio::task::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });
            client
        });
        Database {
            client,
        }
    }
}

lazy_static::lazy_static! {
    pub static ref DB: Database =  Database::default();
}
