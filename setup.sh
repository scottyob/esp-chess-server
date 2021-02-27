echo "Setting up node"
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
curl -fsSL https://deb.nodesource.com/setup_15.x | sudo -E bash -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install -y yarn nodejs
sudo apt-get upgrade -y

echo "Setting up amplify"
sudo npm install -g @aws-amplify/cli

sudo apt-get install -y awscli
mkdir ~/.aws
echo "[default]" > ~/.aws/config
echo "region = us-west-2" >> ~/.aws/config

if [ ! -f amplify_credentials ]; then
    echo "[default]" > amplify_credentials
    echo "aws_access_key_id = xxx" >> amplify_credentials
    echo "aws_secret_access_key = xxx" >> amplify_credentials
    echo "NOTE:  Edit amplify_credentials & ~/.aws/credentials file"
fi

cp amplify_credentials > ~/.aws/credentials