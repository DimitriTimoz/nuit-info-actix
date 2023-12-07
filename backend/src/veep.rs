
const HOST: &str = "https://demo.veep.ai/";
const LOGIN_ENDPOINT: &str = "wp-login.php?redirect_to=https%3A%2F%2Fdemo.veep.ai%2Fwp-admin%2F&reauth=1";

/*
    log: robot-mouche
    pwd: TG#qK7ko6TB4g3N6gvU3@pW5
    rememberme: forever
    wp-submit: Se connecter
    redirect_to: https://demo.veep.ai/wp-admin/
    testcookie: 1
*/

pub async fn login(client: &mut reqwest::Client) {
    let res = client.post(format!("{}{}", HOST, LOGIN_ENDPOINT))
        .form(&[("log", "robot-mouche"), ("pwd", "TG#qK7ko6TB4g3N6gvU3@pW5"), ("rememberme", "forever"), ("wp-submit", "Se connecter"), ("redirect_to", "https://demo.veep.ai/wp-admin/"), ("testcookie", "1")])
        .send().await.unwrap();
    println!("Response: {:?}", res.text().await.unwrap());
}

pub async fn send_file(client: &mut reqwest::Client, file: &str) {
    let res = client.post(format!("{}{}", HOST, "a3f2df7d-fbad-4a56-ace6-a0251be54f3c"))
        .form(&[("action", "veep_upload"), ("file", file)])
        .send().await.unwrap();
    println!("Response: {:?}", res);
}

