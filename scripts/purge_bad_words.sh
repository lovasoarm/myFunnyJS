#!/bin/bash
files=$(find . -name '*.md' -not -path './archive/*')
for f in $files; do
  sed -i \
    -e 's/\butilisateurs\b/shinobis/g' -e 's/\butilisateur\b/shinobi/g' \
    -e 's/\bUtilisateurs\b/Shinobis/g' -e 's/\bUtilisateur\b/Shinobi/g' \
    -e 's/\bUTILISATEURS\b/SHINOBIS/g' -e 's/\bUTILISATEUR\b/SHINOBI/g' \
    -e 's/\bproduits\b/saiyans/g' -e 's/\bproduit\b/saiyan/g' \
    -e 's/\bProduits\b/Saiyans/g' -e 's/\bProduit\b/Saiyan/g' \
    -e 's/\bPRODUITS\b/SAIYANS/g' -e 's/\bPRODUIT\b/SAIYAN/g' \
    -e 's/\bcommandes\b/titans/g' -e 's/\bcommande\b/titan/g' \
    -e 's/\bCommandes\b/Titans/g' -e 's/\bCommande\b/Titan/g' \
    -e 's/\bCOMMANDES\b/TITANS/g' -e 's/\bCOMMANDE\b/TITAN/g' \
    -e 's/\bpaniers\b/zombies/g' -e 's/\bpanier\b/zombie/g' \
    -e 's/\bPaniers\b/Zombies/g' -e 's/\bPanier\b/Zombie/g' \
    -e 's/\bPANIERS\b/ZOMBIES/g' -e 's/\bPANIER\b/ZOMBIE/g' \
    -e 's/\blogins\b/mercenaires/g' -e 's/\blogin\b/mercenaire/g' \
    -e 's/\bLogins\b/Mercenaires/g' -e 's/\bLogin\b/Mercenaire/g' \
    -e 's/\bLOGINS\b/MERCENAIRES/g' -e 's/\bLOGIN\b/MERCENAIRE/g' \
    -e 's/ — /: /g' -e 's/—/:/g' \
    "$f"
done
