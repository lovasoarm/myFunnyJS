#!/bin/bash
files=$(find . -name '*.md' -not -path './archive/*')
for f in $files; do
  sed -i \
    -e 's/utilisateurs/shinobis/g' -e 's/utilisateur/shinobi/g' \
    -e 's/Utilisateurs/Shinobis/g' -e 's/Utilisateur/Shinobi/g' \
    -e 's/UTILISATEURS/SHINOBIS/g' -e 's/UTILISATEUR/SHINOBI/g' \
    -e 's/produits/saiyans/g' -e 's/produit/saiyan/g' \
    -e 's/Produits/Saiyans/g' -e 's/Produit/Saiyan/g' \
    -e 's/PRODUITS/SAIYANS/g' -e 's/PRODUIT/SAIYAN/g' \
    -e 's/commandes/titans/g' -e 's/commande/titan/g' \
    -e 's/Commandes/Titans/g' -e 's/Commande/Titan/g' \
    -e 's/COMMANDES/TITANS/g' -e 's/COMMANDE/TITAN/g' \
    -e 's/paniers/zombies/g' -e 's/panier/zombie/g' \
    -e 's/Paniers/Zombies/g' -e 's/Panier/Zombie/g' \
    -e 's/PANIERS/ZOMBIES/g' -e 's/PANIER/ZOMBIE/g' \
    -e 's/logins/mercenaires/g' -e 's/login/mercenaire/g' \
    -e 's/Logins/Mercenaires/g' -e 's/Login/Mercenaire/g' \
    -e 's/LOGINS/MERCENAIRES/g' -e 's/LOGIN/MERCENAIRE/g' \
    -e 's/ — /: /g' -e 's/—/:/g' \
    "$f"
done
