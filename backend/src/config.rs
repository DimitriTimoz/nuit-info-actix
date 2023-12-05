use serde::Deserialize;
#[derive(Debug, Default, Deserialize)]
pub struct ServerConfig {
    pub pg: deadpool_postgres::Config,
}
