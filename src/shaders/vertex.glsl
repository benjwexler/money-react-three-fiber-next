
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;
attribute float aRandom;

uniform float uCoefficient;
uniform float uRotation;
varying vec2 vUv;

// varying float vRandom;

float pi = 3.1415926535897932384626433832795;
float degrees_to_radians(float degrees){
  // float pi = 3.1415926535897932384626433832795;
    return degrees * (pi / 180.0);
}

void main()
{

  vec3 positionClone = position;
  vec4 modelPosition = modelMatrix * vec4(positionClone, 1.0);
  float exponent = 2.0;
  float xVal = uv.x - 0.5; 
  float zDelta = pow((uCoefficient * (xVal)), exponent);
  modelPosition.z -= sin(pi*uv.x) * uCoefficient;
  // modelPosition.z += zDelta;
     

  float adjustCoordX = uv.x - 0.5;
  float valOfWhenToBend = 0.0;
     float rotationAmount = degrees_to_radians(uRotation);
     float x = modelPosition.x;
     float z = modelPosition.z;

  if(adjustCoordX < -valOfWhenToBend ) {
    modelPosition.x += valOfWhenToBend;
  float x1 = modelPosition.x;
    

    if( abs(pow(zDelta, 2.0) - pow(xVal, 2.0)) < abs(uv.x - 0.5) ) {
    //  modelPosition.x += pow(zDelta, 2.0) - pow(xVal, 2.0);
    } else {
            modelPosition.z -= zDelta;
      modelPosition.x = 0.0;
    }
  }


  if(adjustCoordX > valOfWhenToBend ) {
  modelPosition.x -= valOfWhenToBend;
   float x2 = modelPosition.x;

    if( abs(pow(zDelta, 2.0) - pow(xVal, 2.0)) < abs(uv.x - 0.5) ) {
    //  modelPosition.x -= (pow(zDelta, 2.0) - pow(xVal, 2.0)) ;
    } else {
      modelPosition.z -= zDelta;
      modelPosition.x = 0.0;
      
    }
  }

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;

  vUv = uv;

}
