// aria-label doit exister sur bouton sans texte.
const el={tag:'button',text:'',aria:'fermer'};console.log(el.text||el.aria?'ok':'ko')
