"""
WinHire Agent Manager
Runs all recruitment automation agents in a coordinated manner
"""
import requests
import time
import logging
import threading
from datetime import datetime
from typing import List, Dict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# API Configuration
API_BASE_URL = "http://localhost:5000/api"
CHECK_INTERVAL = 60  # Run every 60 seconds

class AgentManager:
    """Manages all recruitment automation agents"""
    
    def __init__(self):
        self.agents = []
        self.running = False
        self.logger = logging.getLogger('AgentManager')
        
    def register_agent(self, agent):
        """Register an agent to be managed"""
        self.agents.append(agent)
        self.logger.info(f"Registered agent: {agent.name}")
        
    def start_all(self):
        """Start all registered agents"""
        self.running = True
        self.logger.info("=" * 60)
        self.logger.info("WinHire Agent Manager Started")
        self.logger.info("=" * 60)
        
        threads = []
        for agent in self.agents:
            thread = threading.Thread(target=agent.run, daemon=True)
            thread.start()
            threads.append(thread)
            
        # Keep main thread alive
        try:
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            self.logger.info("\nShutting down agents...")
            self.running = False
            for thread in threads:
                thread.join(timeout=2)
            self.logger.info("All agents stopped")


class BaseAgent:
    """Base class for all agents"""
    
    def __init__(self, name: str):
        self.name = name
        self.api_url = f"{API_BASE_URL}/candidates"
        self.logger = logging.getLogger(name)
        self.running = False
        
    def get_all_candidates(self):
        """Fetch all candidates from API"""
        try:
            response = requests.get(self.api_url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error fetching candidates: {e}")
            return []
    
    def update_candidate_status(self, candidate_id, status):
        """Update candidate status"""
        try:
            url = f"{self.api_url}/{candidate_id}/status"
            payload = {"status": status}
            response = requests.put(url, json=payload, timeout=10)
            response.raise_for_status()
            self.logger.info(f"✓ Candidate ID {candidate_id} status updated to '{status}'")
            return True
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error updating candidate {candidate_id}: {e}")
            return False
            
    def process_candidates(self):
        """Override in subclass"""
        raise NotImplementedError
        
    def run(self):
        """Run the agent continuously"""
        self.running = True
        self.logger.info(f"=== {self.name} Started ===")
        self.logger.info(f"Checking every {CHECK_INTERVAL} seconds")
        
        while self.running:
            try:
                self.process_candidates()
            except Exception as e:
                self.logger.error(f"Unexpected error: {e}")
            
            time.sleep(CHECK_INTERVAL)


class IntakeAgent(BaseAgent):
    """Agent 1: Assigns 'Application Received' to candidates without status"""
    
    def __init__(self):
        super().__init__("IntakeAgent")
        
    def process_candidates(self):
        self.logger.info("Processing candidate intake...")
        candidates = self.get_all_candidates()
        
        if not candidates:
            self.logger.info("No candidates found")
            return
            
        processed_count = 0
        for candidate in candidates:
            if not candidate.get('status') or candidate['status'].strip() == "":
                self.logger.info(f"Found candidate without status: {candidate['name']} (ID: {candidate['id']})")
                if self.update_candidate_status(candidate['id'], "Application Received"):
                    processed_count += 1
        
        if processed_count > 0:
            self.logger.info(f"Processed {processed_count} candidate(s)")
        else:
            self.logger.debug("No candidates require status update")


class WorkflowAgent(BaseAgent):
    """Agent 2: Moves candidates through workflow stages"""
    
    def __init__(self):
        super().__init__("WorkflowAgent")
        self.transitions = {
            "Application Received": "Under Review",
            "Under Review": "Shortlisted"
        }
        
    def process_candidates(self):
        self.logger.info("Processing workflow transitions...")
        candidates = self.get_all_candidates()
        
        if not candidates:
            self.logger.info("No candidates found")
            return
            
        processed_count = 0
        for candidate in candidates:
            current_status = candidate.get('status', '').strip()
            if current_status in self.transitions:
                new_status = self.transitions[current_status]
                self.logger.info(f"Transitioning: {candidate['name']} (ID: {candidate['id']}) - '{current_status}' → '{new_status}'")
                if self.update_candidate_status(candidate['id'], new_status):
                    processed_count += 1
        
        if processed_count > 0:
            self.logger.info(f"Transitioned {processed_count} candidate(s)")
        else:
            self.logger.debug("No candidates require workflow transition")


class InterviewAgent(BaseAgent):
    """Agent 3: Schedules interviews for shortlisted candidates"""
    
    def __init__(self):
        super().__init__("InterviewAgent")
        
    def process_candidates(self):
        self.logger.info("Processing interview scheduling...")
        candidates = self.get_all_candidates()
        
        if not candidates:
            self.logger.info("No candidates found")
            return
            
        processed_count = 0
        for candidate in candidates:
            current_status = candidate.get('status', '').strip()
            if current_status == "Shortlisted":
                self.logger.info(f"Scheduling interview for: {candidate['name']} (ID: {candidate['id']})")
                if self.update_candidate_status(candidate['id'], "Interview Scheduled"):
                    processed_count += 1
        
        if processed_count > 0:
            self.logger.info(f"Scheduled {processed_count} interview(s)")
        else:
            self.logger.debug("No candidates require interview scheduling")


if __name__ == "__main__":
    # Create agent manager
    manager = AgentManager()
    
    # Register all agents
    manager.register_agent(IntakeAgent())
    manager.register_agent(WorkflowAgent())
    manager.register_agent(InterviewAgent())
    
    # Start all agents
    print("\n" + "="*60)
    print("  WinHire Recruitment Automation Agents")
    print("="*60)
    print(f"\n  API URL: {API_BASE_URL}")
    print(f"  Check Interval: {CHECK_INTERVAL} seconds")
    print(f"  Agents: Intake, Workflow, Interview")
    print("\n" + "="*60)
    print("\nPress Ctrl+C to stop all agents\n")
    
    manager.start_all()
