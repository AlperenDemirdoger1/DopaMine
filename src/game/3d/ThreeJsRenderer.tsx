import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GameState, Enemy, Player, PowerUp, Collectible, Obstacle } from '../types';

interface ThreeJsRendererProps {
  gameState: GameState;
  width: number;
  height: number;
}

const CharacterModel: React.FC<{ player: Player }> = ({ player }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (mesh.current) {
      mesh.current.position.x = player.position.x / 100;
      mesh.current.position.z = player.position.y / 100;
    }
  }, [player.position]);
  
  return (
    <mesh 
      ref={mesh} 
      position={[player.position.x / 100, 0.5, player.position.y / 100]}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={player.type === 'warrior' ? 'red' : player.type === 'mage' ? 'blue' : 'green'} />
    </mesh>
  );
};

const EnemyModel: React.FC<{ enemy: Enemy }> = ({ enemy }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (mesh.current) {
      mesh.current.position.x = enemy.position.x / 100;
      mesh.current.position.z = enemy.position.y / 100;
    }
  }, [enemy.position]);
  
  const getEnemyGeometry = () => {
    switch (enemy.type) {
      case 'archer':
        return <coneGeometry args={[0.5, 1, 4]} />;
      case 'mage':
        return <sphereGeometry args={[0.5, 8, 8]} />;
      case 'brute':
        return <boxGeometry args={[1.2, 1.2, 1.2]} />;
      case 'boss':
        return <dodecahedronGeometry args={[0.8]} />;
      default:
        return <boxGeometry args={[0.8, 0.8, 0.8]} />;
    }
  };
  
  const getEnemyColor = () => {
    switch (enemy.type) {
      case 'archer':
        return 'lightgreen';
      case 'mage':
        return 'purple';
      case 'brute':
        return 'brown';
      case 'boss':
        return 'darkred';
      default:
        return 'gray';
    }
  };
  
  return (
    <mesh 
      ref={mesh} 
      position={[enemy.position.x / 100, 0.5, enemy.position.y / 100]}
      castShadow
    >
      {getEnemyGeometry()}
      <meshStandardMaterial color={getEnemyColor()} />
    </mesh>
  );
};

const PowerUpModel: React.FC<{ powerUp: PowerUp }> = ({ powerUp }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
    }
  });
  
  if (powerUp.collected) return null;
  
  return (
    <mesh 
      ref={mesh} 
      position={[powerUp.position.x / 100, 0.3, powerUp.position.y / 100]}
    >
      <octahedronGeometry args={[0.3]} />
      <meshStandardMaterial 
        color={powerUp.type === 'health' ? 'red' : powerUp.type === 'speed' ? 'blue' : 'yellow'} 
        emissive={powerUp.type === 'health' ? 'red' : powerUp.type === 'speed' ? 'blue' : 'yellow'}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

const CollectibleModel: React.FC<{ collectible: Collectible }> = ({ collectible }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.02;
    }
  });
  
  if (collectible.collected) return null;
  
  return (
    <mesh 
      ref={mesh} 
      position={[collectible.position.x / 100, 0.2, collectible.position.y / 100]}
    >
      <torusGeometry args={[0.2, 0.1, 8, 16]} />
      <meshStandardMaterial 
        color={collectible.type === 'coin' ? 'gold' : collectible.type === 'gem' ? 'cyan' : 'white'} 
        emissive={collectible.type === 'coin' ? 'gold' : collectible.type === 'gem' ? 'cyan' : 'white'}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

const ObstacleModel: React.FC<{ obstacle: Obstacle }> = ({ obstacle }) => {
  const getObstacleGeometry = () => {
    switch (obstacle.type) {
      case 'spike':
        return <coneGeometry args={[0.5, 1, 4]} />;
      case 'laser':
        return <cylinderGeometry args={[0.1, 0.1, 1, 8]} />;
      case 'turret':
        return <cylinderGeometry args={[0.3, 0.5, 0.8, 8]} />;
      case 'wall':
        return <boxGeometry args={[1, 1, 1]} />;
      default:
        return <boxGeometry args={[0.8, 0.8, 0.8]} />;
    }
  };
  
  return (
    <mesh 
      position={[obstacle.position.x / 100, 0.5, obstacle.position.y / 100]}
      castShadow
      receiveShadow
    >
      {getObstacleGeometry()}
      <meshStandardMaterial 
        color={obstacle.type === 'spike' ? 'darkgray' : 
               obstacle.type === 'laser' ? 'red' : 
               obstacle.type === 'turret' ? 'darkblue' : 'gray'} 
      />
    </mesh>
  );
};

const Floor: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[width / 50, height / 50]} />
      <meshStandardMaterial color="#444" />
    </mesh>
  );
};

const CameraController: React.FC<{ player: Player }> = ({ player }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(player.position.x / 100, 10, player.position.y / 100 + 10);
    camera.lookAt(player.position.x / 100, 0, player.position.y / 100);
  }, [camera, player.position]);
  
  useFrame(() => {
    camera.position.x = player.position.x / 100;
    camera.position.z = player.position.y / 100 + 10;
    camera.lookAt(player.position.x / 100, 0, player.position.y / 100);
  });
  
  return null;
};

const Scene: React.FC<{ gameState: GameState; width: number; height: number }> = ({ 
  gameState, 
  width, 
  height 
}) => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      <CameraController player={gameState.player} />
      
      <Floor width={width} height={height} />
      
      <CharacterModel player={gameState.player} />
      
      {gameState.currentRoom.enemies.map(enemy => (
        <EnemyModel key={enemy.id} enemy={enemy} />
      ))}
      
      {gameState.powerUps.map(powerUp => (
        <PowerUpModel key={powerUp.id} powerUp={powerUp} />
      ))}
      
      {gameState.collectibles.map(collectible => (
        <CollectibleModel key={collectible.id} collectible={collectible} />
      ))}
      
      {gameState.obstacles.map(obstacle => (
        <ObstacleModel key={obstacle.id} obstacle={obstacle} />
      ))}
    </>
  );
};

const ThreeJsRenderer: React.FC<ThreeJsRendererProps> = ({ gameState, width, height }) => {
  if (!gameState) return null;
  
  return (
    <div className="absolute inset-0">
      <Canvas shadows>
        <Scene gameState={gameState} width={width} height={height} />
      </Canvas>
    </div>
  );
};

export default ThreeJsRenderer;
