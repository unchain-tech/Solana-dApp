solana-keygen new --outfile fooKey.json --force --no-bip39-passphrase
solana config set --keypair fooKey.json && solana config set --url localhost
solana-keygen new -o target/deploy/myepicproject-keypair.json --force --no-bip39-passphrase
solana-test-validator -r --quiet &
solana airdrop 1000
yarn build
yarn deploy
v=`solana address -k target/deploy/myepicproject-keypair.json`
sed -i "" "3s/^.*/declare_id!(\"$v\");/" programs/myepicproject/src/lib.rs && sed -i "" "6s/^.*/myepicproject = \"$v\"/" Anchor.toml
yarn build
yarn deploy
yarn test