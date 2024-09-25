import React from 'react';
import { Slider, ColorPicker, Button, Stack, Text, Divider } from '@mantine/core';
import { IconEraser, IconArrowBackUp, IconArrowForwardUp, IconDownload, IconPalette, IconRuler } from '@tabler/icons-react';

interface SidebarProps {
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onEraser: () => void;
  onDownload: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  color,
  setColor,
  brushSize,
  setBrushSize,
  onUndo,
  onRedo,
  onEraser,
  onDownload,
}) => {
  return (
    <div className="w-72 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 p-6 shadow-lg">
      <Stack gap="xl">
        
        <div>
          <Text size="sm" className="flex items-center mb-2">
            <IconPalette size={18} className="mr-2 text-blue-300" />
            Brush Color
          </Text>
          <ColorPicker format="rgba" value={color} onChange={setColor} fullWidth />
        </div>
        
        <Divider my="sm" />
        
        <div>
          <Text size="sm" className="flex items-center mb-2">
            <IconRuler size={18} className="mr-2 text-blue-300" />
            Brush Size
          </Text>
          <Slider
            min={1}
            max={20}
            value={brushSize}
            onChange={setBrushSize}
            marks={[
              { value: 1, label: '1' },
              { value: 10, label: '10' },
              { value: 20, label: '20' },
            ]}
            styles={{
              markLabel: { color: '#E5E7EB' },
              thumb: { borderColor: '#3B82F6' },
              bar: { backgroundColor: '#3B82F6' },
            }}
          />
        </div>
        
        <Divider my="sm" />
        
        <Stack gap="md">
          <Button.Group>
            <Button onClick={onUndo} variant="outline" leftSection={<IconArrowBackUp size={16} />} className="flex-1 border-blue-400 text-blue-300 hover:bg-blue-800">Undo</Button>
            <Button onClick={onRedo} variant="outline" leftSection={<IconArrowForwardUp size={16} />} className="flex-1 border-blue-400 text-blue-300 hover:bg-blue-800">Redo</Button>
          </Button.Group>
          
          <Button onClick={onEraser} variant="outline" leftSection={<IconEraser size={16} />} className="w-full border-blue-400 text-blue-300 hover:bg-blue-800">
            Eraser
          </Button>
          
          <Button onClick={onDownload} variant="filled" leftSection={<IconDownload size={16} />} className="w-full bg-blue-500 hover:bg-blue-600">
            Download
          </Button>
        </Stack>
      </Stack>
    </div>
  );
};

export default Sidebar;