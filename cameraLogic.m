clear;
clc;
cla reset;

% Cube settings
rubikDim = 5;
cubeW = 100;

% Code
hold on;

% Draw visual help
% ejesX = [[1, -1]; [1, -1]; [0, 0]];
% ejesY = [[1, -1]; [-1, 1]; [0, 0]];
% ejesZ = [[0,  0]; [0,  0]; [sqrt(2), -sqrt(2)]];
% for x = 1:3
%     plot3(ejesX(x, :) .* cubeW, ejesY(x, :) .* cubeW, ejesZ(x, :) .* cubeW, "k-");
% end

% draw Cube border
pieces = [-rubikDim / 2, rubikDim / 2] .* cubeW;
for p1 = pieces
    for p2 = pieces
        plot3([p1, p1], [p2, p2], pieces, "k")
        plot3([p1, p1], pieces, [p2, p2], "k")
        plot3(pieces, [p1, p1], [p2, p2], "k")
    end
end

if mod(rubikDim, 2) == 0
    m = 0 : rubikDim / 2 - 1;
else
    m = 0.5 : rubikDim / 2 - 0.5;
end

colors = [["b", "g"]; ["m", "r"]; ["k", "y"]];
i = 1;
for p1 = pieces
    for mm = m
        pieces2 = [-1, 1] .* (mm * cubeW);
        for p2 = pieces2
            % Blue and green
            plot3([p1, p1], [p2, p2], pieces, colors(1, i + 1))
            plot3([p1, p1], pieces, [p2, p2], colors(1, i + 1))
            
            % Orange and red
            plot3([p2, p2], [p1, p1], pieces, colors(2, i + 1))
            plot3(pieces, [p1, p1], [p2, p2], colors(2, i + 1))
            
            % White and yellow
            plot3([p2, p2], pieces, [p1, p1], colors(3, i + 1))
            plot3(pieces, [p2, p2], [p1, p1], colors(3, i + 1))
        end
    end
    i = mod(i + 1, 2);
end




% Camera
angle = pi / 6 * 0.5;
aspectRatio = 16/9;

ampli = 700;
angX = 0.25 * pi;
angZ = 0.25 * pi;

trueIncX = -0.25 * pi;
trueIncZ = 0;

% camX =  ampli * cos(angX + trueIncX) * sin(angZ + trueIncZ);
% camY =  ampli * sin(angX + trueIncX) * sin(angZ + trueIncZ);
% camZ =  ampli * cos(angZ + trueIncZ);

camRotationMatrix = rotationMatrix3D("Z", angX) * rotationMatrix3D("Y", angZ);

camCoord = camRotationMatrix * [ampli, 0, 0]';
camX = camCoord(1);
camY = camCoord(2);
camZ = camCoord(3);
plot3([camX, 0], [camY, 0], [camZ, 0], "b-*");

planeV = ampli * sin(angle);
planeH = planeV * aspectRatio;

planeVectors = [ ...
    camRotationMatrix * [0;  planeH;  planeH], ...
    camRotationMatrix * [0;  planeH; -planeH], ...
    camRotationMatrix * [0; -planeH; -planeH], ...
    camRotationMatrix * [0; -planeH;  planeH] ...
]

for i = 1:4
    p1 = planeVectors(:, i)';
    index = i + 1;
    if index == 5
        index = 1;
    end
    p2 = planeVectors(:, index)';
    plot3([p1(1), p2(1)], [p1(2), p2(2)], [p1(3), p2(3)], "g-*");
    
    plot3([p1(1), camX], [p1(2), camY], [p1(3), camZ], "k-");
end


hold off;

mult = 1;
axis([-ampli * mult, ampli * mult, -ampli * mult, ampli * mult, -ampli * mult, ampli * mult])
xlabel("X"); ylabel("Y"); zlabel("Z");
view(135, 45)
grid MINOR;