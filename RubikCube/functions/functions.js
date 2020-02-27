function applyM(axis, angle){
    let u = axis.copy().normalize();
  
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let oneC = 1 - c;
    
    
    let a = c + u.x * u.x * oneC;
    let b = u.x * u.y * oneC - u.z * s;
    let ce = u.x * u.z * oneC + u.y * s;
    
    let d = u.y * u.x * oneC + u.z * s;
    let e = c + u.y * u.y * oneC;
    let f = u.y * u.z * oneC - u.x * s;
    
    let g = u.z * u.x * oneC - u.y * s;
    let h = u.z * u.y * oneC + u.x * s;
    let i = c + u.z * u.z * oneC;
      
    applyMatrix(a, b, ce,
                d, e, f,
                g, h, i);
  }
  
  function keyPressed() {
    switch(keyCode){
      case 85:
        rubik.m("U");
        break;
      case 68:
        rubik.m("D");
        break;
      case 82:
        rubik.m("R");
        break;
      case 76:
        rubik.m("L");
        break;
    }
  }