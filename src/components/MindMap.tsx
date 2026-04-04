import React, { useEffect, useLayoutEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node, 
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  Handle,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MindMapNode } from '../types';
import { Info } from 'lucide-react';
import { useLandingLocale } from '../hooks/useLandingLocale';
import { APP_COPY } from '../i18n/appCopy';

interface MindMapProps {
  data: MindMapNode | null;
}

const MindMapCustomNode = ({ data }: any) => {
  return (
    <div className="relative group max-w-[220px]">
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-zinc-400" />
      <div 
        className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
          data.isRoot 
            ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl' 
            : 'bg-white border-zinc-200 text-zinc-900 shadow-sm hover:border-zinc-400'
        }`}
      >
        <span className="font-medium text-sm leading-tight block">{data.label}</span>
        {data.notes ? (
          <div
            className={`mt-2 pt-2 border-t text-xs leading-relaxed ${
              data.isRoot ? 'border-zinc-800 text-zinc-300' : 'border-zinc-100 text-zinc-600'
            }`}
          >
            {data.notes}
          </div>
        ) : null}
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-zinc-400" />
    </div>
  );
};

const nodeTypes = {
  mindMapNode: MindMapCustomNode,
};

const getLayoutedElements = (root: MindMapNode) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Calculate the height of each sub-tree to prevent overlapping
  const calculateSubtreeHeight = (node: MindMapNode): number => {
    if (!node.children || node.children.length === 0) {
      return 100; // Base height for a single node
    }
    // Sum of children heights + spacing between children
    const childrenHeight = node.children.reduce((acc, child) => acc + calculateSubtreeHeight(child), 0);
    const spacing = (node.children.length - 1) * 20; // 20px spacing between siblings
    return Math.max(100, childrenHeight + spacing);
  };

  const traverse = (node: MindMapNode, x: number, y: number, level: number) => {
    nodes.push({
      id: node.id,
      type: 'mindMapNode',
      data: { 
        label: node.label, 
        notes: node.notes,
        isRoot: level === 0 
      },
      position: { x, y },
    });

    if (node.children && node.children.length > 0) {
      const totalSubtreeHeight = calculateSubtreeHeight(node);
      let currentY = y - totalSubtreeHeight / 2;

      node.children.forEach((child) => {
        const childSubtreeHeight = calculateSubtreeHeight(child);
        const childX = x + 300; // Horizontal spacing
        const childY = currentY + childSubtreeHeight / 2;
        
        edges.push({
          id: `${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#a1a1aa', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#a1a1aa',
          },
        });
        
        traverse(child, childX, childY, level + 1);
        currentY += childSubtreeHeight + 20; // Add spacing
      });
    }
  };

  traverse(root, 100, 0, 0); // Start root at Y=0; fitView runs after nodes sync into React Flow
  return { nodes, edges };
};

/** 仅在「新树」时适配视口；依赖 nodes 会在拖拽时反复 fitView。 */
const FitViewOnData: React.FC<{ tree: MindMapNode }> = ({ tree }) => {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      fitView({ padding: 0.2, duration: 200 });
    });
    return () => cancelAnimationFrame(id);
  }, [tree, fitView]);
  return null;
};

const MindMapCanvas: React.FC<{ data: MindMapNode }> = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useLayoutEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(data);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [data, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      className="bg-zinc-50"
      fitView
    >
      <FitViewOnData tree={data} />
      <Background color="#e4e4e7" gap={20} variant="dots" />
      <Controls />
    </ReactFlow>
  );
};

export const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const { locale } = useLandingLocale();
  const t = APP_COPY[locale];
  return (
    <div className="w-full h-full bg-zinc-50 relative min-h-0">
      {!data ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 font-sans space-y-4 px-6">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center">
            <Info size={24} className="opacity-20" />
          </div>
          <p className="italic text-sm text-center max-w-sm leading-relaxed">{t.mindMapEmpty}</p>
        </div>
      ) : (
        <MindMapCanvas data={data} />
      )}
    </div>
  );
};
