#!/usr/bin/env python3
"""
Script to create Cloudinary upload preset programmatically.
Run this script to automatically create the 'jira_uploads' preset.
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME', 'dzw2iow1i')
API_KEY = os.getenv('CLOUDINARY_API_KEY', '383443795275869')
API_SECRET = os.getenv('CLOUDINARY_API_SECRET', 'F1exMuP_4NW3lDE9KKXGNeVPKgk')

def create_upload_preset():
    """Create an unsigned upload preset for the frontend."""
    
    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/upload_presets"
    
    preset_data = {
        "name": "jira_uploads",
        "unsigned": True,
        "folder": "jira/workspaces",
        "allowed_formats": "jpg,png,gif,webp,jpeg",
        "max_file_size": 5000000,  # 5MB
        "access_mode": "public",
        "use_filename": True,
        "unique_filename": True,
        "overwrite": False,
    }
    
    try:
        response = requests.post(
            url,
            auth=(API_KEY, API_SECRET),
            json=preset_data
        )
        
        if response.status_code == 200:
            print("✅ Upload preset 'jira_uploads' created successfully!")
            print("\nPreset details:")
            print(f"  Name: {preset_data['name']}")
            print(f"  Unsigned: {preset_data['unsigned']}")
            print(f"  Folder: {preset_data['folder']}")
            print(f"  Max size: {preset_data['max_file_size']} bytes (5MB)")
            print("\n🎉 You can now upload images in your frontend!")
            return True
        elif response.status_code == 409:
            print("⚠️  Upload preset 'jira_uploads' already exists!")
            print("✅ You can use it in your frontend.")
            return True
        else:
            print(f"❌ Error creating preset: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def verify_credentials():
    """Verify Cloudinary credentials are correct."""
    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/image"
    
    try:
        response = requests.get(url, auth=(API_KEY, API_SECRET))
        
        if response.status_code == 200:
            print("✅ Cloudinary credentials verified!")
            return True
        else:
            print(f"❌ Invalid credentials: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error verifying credentials: {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Cloudinary Upload Preset Setup Script")
    print("=" * 60)
    print()
    
    print("Step 1: Verifying credentials...")
    if not verify_credentials():
        print("\n❌ Please check your Cloudinary credentials in .env file")
        print(f"Current settings:")
        print(f"  CLOUDINARY_CLOUD_NAME: {CLOUD_NAME}")
        print(f"  CLOUDINARY_API_KEY: {API_KEY}")
        exit(1)
    
    print("\nStep 2: Creating upload preset...")
    if create_upload_preset():
        print("\n" + "=" * 60)
        print("✅ Setup complete! Your frontend is ready to upload images.")
        print("=" * 60)
    else:
        print("\n❌ Setup failed. Please create the preset manually:")
        print("   1. Go to https://cloudinary.com/console")
        print("   2. Settings → Upload → Upload presets")
        print("   3. Create preset named 'jira_uploads' (unsigned)")
