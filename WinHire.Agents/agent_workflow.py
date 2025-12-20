import requests
import time
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('WorkflowAgent')

# API Configuration
API_BASE_URL = "http://localhost:5000/api"
CHECK_INTERVAL = 60  # Run every 60 seconds (1 minute)

class WorkflowAgent:
    """
    Agent 2: Workflow Agent
    If status = "Application Received" → change to "Under Review"
    If status = "Under Review" → change to "Shortlisted"
    """
    
    def __init__(self):
        self.api_url = f"{API_BASE_URL}/candidates"
        self.workflow_transitions = {
            "Application Received": "Under Review",
            "Under Review": "Shortlisted"
        }
    
    def get_all_candidates(self):
        """Fetch all candidates from API"""
        try:
            response = requests.get(self.api_url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching candidates: {e}")
            return []
    
    def update_candidate_status(self, candidate_id, current_status, new_status):
        """Update candidate status"""
        try:
            url = f"{self.api_url}/{candidate_id}/status"
            payload = {"status": new_status}
            response = requests.put(url, json=payload, timeout=10)
            response.raise_for_status()
            logger.info(f"✓ Candidate ID {candidate_id}: '{current_status}' → '{new_status}'")
            return True
        except requests.exceptions.RequestException as e:
            logger.error(f"Error updating candidate {candidate_id}: {e}")
            return False
    
    def process_candidates(self):
        """Main processing logic"""
        logger.info("Starting workflow processing...")
        
        candidates = self.get_all_candidates()
        
        if not candidates:
            logger.info("No candidates found or API unreachable")
            return
        
        processed_count = 0
        
        for candidate in candidates:
            current_status = candidate.get('status', '').strip()
            
            # Check if current status should be transitioned
            if current_status in self.workflow_transitions:
                new_status = self.workflow_transitions[current_status]
                logger.info(f"Processing: {candidate['name']} (ID: {candidate['id']}) - Current: '{current_status}'")
                
                if self.update_candidate_status(candidate['id'], current_status, new_status):
                    processed_count += 1
        
        if processed_count > 0:
            logger.info(f"Transitioned {processed_count} candidate(s)")
        else:
            logger.info("No candidates require workflow transition")
    
    def run(self):
        """Run the agent continuously"""
        logger.info("=== Workflow Agent Started ===")
        logger.info(f"Checking every {CHECK_INTERVAL} seconds")
        logger.info(f"API URL: {self.api_url}")
        logger.info(f"Workflow transitions: {self.workflow_transitions}")
        
        while True:
            try:
                self.process_candidates()
            except Exception as e:
                logger.error(f"Unexpected error in main loop: {e}")
            
            logger.info(f"Sleeping for {CHECK_INTERVAL} seconds...\n")
            time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    agent = WorkflowAgent()
    agent.run()
