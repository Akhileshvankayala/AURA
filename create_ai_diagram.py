#!/usr/bin/env python3
"""
AURA AI Agents Architecture Visualization
This script creates a visual representation of the AI agent components in the AURA system.
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, ConnectionPatch
import numpy as np

def create_ai_agents_diagram():
    """Create a comprehensive diagram of AI agents in the AURA system"""
    
    fig, ax = plt.subplots(1, 1, figsize=(16, 12))
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 12)
    ax.set_aspect('equal')
    ax.axis('off')
    
    # Title
    ax.text(8, 11.5, 'AURA: AI Agents Architecture', 
            fontsize=20, fontweight='bold', ha='center')
    
    # Color scheme
    colors = {
        'input': '#3B82F6',      # Blue
        'processing': '#10B981',  # Green  
        'orchestration': '#8B5CF6', # Purple
        'output': '#F59E0B',     # Orange
        'analytics': '#EF4444'   # Red
    }
    
    # Input Layer (Top)
    input_agents = [
        {'name': 'Camera\nInput', 'pos': (2, 9.5), 'desc': 'Video capture for\ngesture recognition'},
        {'name': 'Voice\nInput', 'pos': (5, 9.5), 'desc': 'Audio capture for\nvoice commands'},
        {'name': 'Text\nInput', 'pos': (8, 9.5), 'desc': 'Keyboard and\ntext input'},
        {'name': 'Touch\nInput', 'pos': (11, 9.5), 'desc': 'UI interactions\nand clicks'},
        {'name': 'Sensor\nInput', 'pos': (14, 9.5), 'desc': 'Environmental\ndata capture'}
    ]
    
    # Processing Layer
    processing_agents = [
        {'name': 'Gesture Recognition\nAgent', 'pos': (3, 7.5), 'desc': 'MediaPipe hand\nlandmark detection'},
        {'name': 'Face Recognition\nAgent', 'pos': (6.5, 7.5), 'desc': 'Student identification\nvia facial features'},
        {'name': 'Voice Processing\nAgent', 'pos': (10, 7.5), 'desc': 'Speech-to-text\nand NLP processing'},
        {'name': 'Chat Bot\nAgent', 'pos': (13, 7.5), 'desc': 'Conversational AI\nfor Q&A'}
    ]
    
    # Orchestration Layer
    orchestration_agents = [
        {'name': 'Application\nOrchestrator', 'pos': (4, 5.5), 'desc': 'Coordinates all\nagent interactions'},
        {'name': 'Event\nDispatcher', 'pos': (8, 5.5), 'desc': 'Routes events to\nappropriate agents'},
        {'name': 'Context\nManager', 'pos': (12, 5.5), 'desc': 'Maintains system\nstate and context'}
    ]
    
    # Output Layer
    output_agents = [
        {'name': 'UI Response\nAgent', 'pos': (2.5, 3.5), 'desc': 'Visual feedback\nand notifications'},
        {'name': 'Attendance\nManager', 'pos': (6, 3.5), 'desc': 'Records and tracks\nattendance data'},
        {'name': 'Communication\nAgent', 'pos': (9.5, 3.5), 'desc': 'SMS, email, chat\nmessage delivery'},
        {'name': 'Dashboard\nAgent', 'pos': (13, 3.5), 'desc': 'Real-time data\nvisualization'}
    ]
    
    # Analytics Layer
    analytics_agents = [
        {'name': 'Pattern Analysis\nAgent', 'pos': (4, 1.5), 'desc': 'Identifies attendance\npatterns and trends'},
        {'name': 'Statistics\nGenerator', 'pos': (8, 1.5), 'desc': 'Computes metrics\nand reports'},
        {'name': 'Prediction\nEngine', 'pos': (12, 1.5), 'desc': 'Forecasts attendance\nand behavior'}
    ]
    
    def draw_agent_box(agent_info, color, layer_name):
        """Draw an individual agent box with styling"""
        x, y = agent_info['pos']
        
        # Main box
        box = FancyBboxPatch((x-0.8, y-0.4), 1.6, 0.8,
                           boxstyle="round,pad=0.1",
                           facecolor=color, alpha=0.7,
                           edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        
        # Agent name
        ax.text(x, y+0.1, agent_info['name'], 
                fontsize=10, fontweight='bold', ha='center', va='center')
        
        # Description (smaller text below)
        ax.text(x, y-0.7, agent_info['desc'], 
                fontsize=8, ha='center', va='top', style='italic')
    
    def draw_layer_label(x, y, label, color):
        """Draw layer labels on the left side"""
        ax.text(0.5, y, label, fontsize=12, fontweight='bold', 
                ha='center', va='center', rotation=90,
                bbox=dict(boxstyle="round,pad=0.3", facecolor=color, alpha=0.5))
    
    # Draw all agents
    for agent in input_agents:
        draw_agent_box(agent, colors['input'], 'Input')
    
    for agent in processing_agents:
        draw_agent_box(agent, colors['processing'], 'Processing')
        
    for agent in orchestration_agents:
        draw_agent_box(agent, colors['orchestration'], 'Orchestration')
        
    for agent in output_agents:
        draw_agent_box(agent, colors['output'], 'Output')
        
    for agent in analytics_agents:
        draw_agent_box(agent, colors['analytics'], 'Analytics')
    
    # Draw layer labels
    draw_layer_label(0.5, 9.5, 'INPUT\nLAYER', colors['input'])
    draw_layer_label(0.5, 7.5, 'PROCESSING\nLAYER', colors['processing'])
    draw_layer_label(0.5, 5.5, 'ORCHESTRATION\nLAYER', colors['orchestration'])
    draw_layer_label(0.5, 3.5, 'OUTPUT\nLAYER', colors['output'])
    draw_layer_label(0.5, 1.5, 'ANALYTICS\nLAYER', colors['analytics'])
    
    # Draw connections between layers
    connections = [
        # Input to Processing
        ((2, 9.1), (3, 7.9)),
        ((5, 9.1), (6.5, 7.9)),
        ((8, 9.1), (10, 7.9)),
        ((11, 9.1), (13, 7.9)),
        
        # Processing to Orchestration
        ((3, 7.1), (4, 5.9)),
        ((6.5, 7.1), (8, 5.9)),
        ((10, 7.1), (8, 5.9)),
        ((13, 7.1), (12, 5.9)),
        
        # Orchestration to Output
        ((4, 5.1), (2.5, 3.9)),
        ((8, 5.1), (6, 3.9)),
        ((8, 5.1), (9.5, 3.9)),
        ((12, 5.1), (13, 3.9)),
        
        # Output to Analytics
        ((6, 3.1), (4, 1.9)),
        ((6, 3.1), (8, 1.9)),
        ((9.5, 3.1), (8, 1.9)),
        ((13, 3.1), (12, 1.9))
    ]
    
    for start, end in connections:
        arrow = ConnectionPatch(start, end, "data", "data",
                              arrowstyle="->", shrinkA=5, shrinkB=5,
                              mutation_scale=15, alpha=0.6, color='gray')
        ax.add_patch(arrow)
    
    # Add legend
    legend_elements = [
        patches.Patch(color=colors['input'], alpha=0.7, label='Input Layer'),
        patches.Patch(color=colors['processing'], alpha=0.7, label='Processing Layer'),
        patches.Patch(color=colors['orchestration'], alpha=0.7, label='Orchestration Layer'),
        patches.Patch(color=colors['output'], alpha=0.7, label='Output Layer'),
        patches.Patch(color=colors['analytics'], alpha=0.7, label='Analytics Layer')
    ]
    
    ax.legend(handles=legend_elements, loc='lower right', 
              bbox_to_anchor=(0.98, 0.02), fontsize=10)
    
    # Add key technologies annotation
    tech_text = """Key AI Technologies:
• MediaPipe (Gesture Recognition)
• OpenCV (Computer Vision)
• TensorFlow (ML Models)
• Scikit-learn (Analytics)
• Flask/FastAPI (Backend)
• React (Frontend)"""
    
    ax.text(15.5, 8, tech_text, fontsize=9, 
            bbox=dict(boxstyle="round,pad=0.5", facecolor='lightgray', alpha=0.8),
            verticalalignment='top')
    
    plt.tight_layout()
    return fig

def main():
    """Main function to create and save the diagram"""
    fig = create_ai_agents_diagram()
    
    # Save the diagram
    plt.savefig('/home/runner/work/AURA/AURA/ai_agents_architecture.png', 
                dpi=300, bbox_inches='tight', facecolor='white')
    
    print("AI Agents Architecture diagram saved as 'ai_agents_architecture.png'")
    
    # Show the plot
    plt.show()

if __name__ == "__main__":
    main()