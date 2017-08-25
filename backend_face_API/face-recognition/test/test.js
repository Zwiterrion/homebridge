function toto () {
  console.log('toto');
}

toto();

toto['tutu'] = function(){
  console.log('tutu');
}

toto.tutu();

toto();
