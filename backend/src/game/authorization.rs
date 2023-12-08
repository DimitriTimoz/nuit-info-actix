use uuid::Uuid;
use actix_web::http::header::HeaderMap;

#[derive(Debug, Clone)]
pub struct Authorization(String);

impl From<Uuid> for Authorization {
    fn from(user_id: Uuid) -> Self {
        Authorization(user_id.to_string())
    }
}

impl From<Authorization> for Uuid {
    fn from(authorization: Authorization) -> Self {
        Uuid::parse_str(&authorization.0).unwrap()
    }
}

impl TryFrom<&HeaderMap> for Authorization {
    type Error = String;

    fn try_from(headers: &HeaderMap) -> Result<Self, Self::Error> {
        let header_value = headers.get("Authorization");

        let token_value = match header_value {
            Some(token) => token.to_str(),
            None => return Err("No token provided".to_owned()),
        };

        let token_string = match token_value {
            Ok(token) => token,
            Err(_) => return Err("Token is not a string".to_owned()),
        };

        let uuid = match Uuid::parse_str(token_string) {
            Ok(uuid) => uuid,
            Err(_) => return Err("Invalid token".to_owned()),
        };

        Ok(Authorization(uuid.to_string()))
    }
}

impl Authorization {
    pub fn new(token: String) -> Self {
        Authorization(token)
    }
}
