export default "#version 300 es\n#define GLSLIFY 1\n\nuniform mat4 uWorldMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform vec3 uCameraPosition;\nuniform vec4 uRotationAxisVelocity;\n\nin vec3 aModelPosition;\nin vec3 aModelNormal;\nin vec2 aModelUvs;\nin mat4 aInstanceMatrix;\n\nout vec2 vUvs;\nout float vAlpha;\nflat out int vInstanceId;\n\n#define PI 3.141593\n\nvoid main() {\n    vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.);\n\n    // center of the disc in world space\n    vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0., 0., 0., 1.)).xyz;\n    float radius = length(centerPos.xyz);\n\n    // skip the center vertex of the disc geometry\n    if (gl_VertexID > 0) {\n        // stretch the disc according to the axis and velocity of the rotation\n        vec3 rotationAxis = uRotationAxisVelocity.xyz;\n        float rotationVelocity = min(.15, uRotationAxisVelocity.w * 15.);\n        // the stretch direction is orthogonal to the rotation axis and the position\n        vec3 stretchDir = normalize(cross(centerPos, rotationAxis));\n        // the position of this vertex relative to the center position\n        vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);\n        // vertices more in line with the stretch direction get a larger offset\n        float strength = dot(stretchDir, relativeVertexPos);\n        float invAbsStrength = min(0., abs(strength) - 1.);\n        strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.);\n        // apply the stretch distortion\n        worldPosition.xyz += stretchDir * strength;\n    }\n\n    // move the vertex back to the overall sphere\n    worldPosition.xyz = radius * normalize(worldPosition.xyz);\n    \n\n    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;\n\n    vAlpha = smoothstep(0.5, 1., normalize(worldPosition.xyz).z) * .9 + .1;\n    vUvs = aModelUvs;\n    vInstanceId = gl_InstanceID;\n}"