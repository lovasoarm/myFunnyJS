// Vendredi 19h. Ça marche sur "60" et "3661". Livré.
function formatArenaTime(s) {
  var h = Math.floor(s / 3600);
  var m = Math.floor((s - h * 3600) / 60);
  var sec = s - h * 3600 - m * 60;
  if (h > 0) return h + "h " + m + "m " + sec + "s";
  if (m > 0) return m + "m " + sec + "s";
  return sec + "s";
}
module.exports = { formatArenaTime };
