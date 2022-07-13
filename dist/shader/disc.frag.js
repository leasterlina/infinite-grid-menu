export default "#version 300 es\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float uFrames;\nuniform float uScaleFactor;\nuniform vec3 uCameraPosition;\nuniform sampler2D uTex;\n\nout vec4 outColor;\n\nin vec2 vUvs;\nin float vAlpha;\nflat in int vInstanceId;\n\nvoid main() {\n    int SIZE = 5;\n    int i = vInstanceId % (SIZE * SIZE);\n    int iX = i % SIZE;\n    int iY =(i - iX) / SIZE;\n    vec2 s = vUvs / float(SIZE);\n    vec2 st = s + vec2(float(iX) / float(SIZE), float(iY) / float(SIZE));\n    st *= 0.9;\n\n    outColor = texture(uTex, st);\n    outColor *= vAlpha;\n}"