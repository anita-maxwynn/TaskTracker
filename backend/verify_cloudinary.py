import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
API_KEY = os.getenv('CLOUDINARY_API_KEY')
API_SECRET = os.getenv('CLOUDINARY_API_SECRET')
PRESET_NAME = 'jira_uploads'

def check_and_fix_preset():
    """Check if upload preset exists and is unsigned, create/fix if needed"""
    
    print("=" * 60)
    print("Cloudinary Upload Preset Verification")
    print("=" * 60)
    
    # Get all upload presets
    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/upload_presets"
    
    try:
        response = requests.get(url, auth=(API_KEY, API_SECRET))
        
        if response.status_code == 200:
            presets = response.json().get('presets', [])
            existing_preset = next((p for p in presets if p['name'] == PRESET_NAME), None)
            
            if existing_preset:
                print(f"\n✅ Preset '{PRESET_NAME}' found!")
                print(f"   - Unsigned: {existing_preset.get('unsigned', False)}")
                print(f"   - Folder: {existing_preset.get('folder', 'root')}")
                
                if not existing_preset.get('unsigned'):
                    print(f"\n⚠️  Preset is SIGNED. Need to make it UNSIGNED...")
                    update_preset_to_unsigned()
                else:
                    print(f"\n✅ Preset is already unsigned. You're good to go!")
            else:
                print(f"\n❌ Preset '{PRESET_NAME}' not found. Creating it...")
                create_unsigned_preset()
        else:
            print(f"❌ Failed to fetch presets: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error: {e}")

def create_unsigned_preset():
    """Create a new unsigned upload preset"""
    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/upload_presets"
    
    data = {
        "name": PRESET_NAME,
        "unsigned": True,
        "folder": "jira/workspaces",
        "tags": ["jira", "workspace"],
        "allowed_formats": "jpg,png,gif,webp,jpeg"
    }
    
    try:
        response = requests.post(url, auth=(API_KEY, API_SECRET), json=data)
        
        if response.status_code in [200, 201]:
            print(f"✅ Successfully created unsigned preset '{PRESET_NAME}'!")
            print(f"   You can now upload images from the frontend.")
        else:
            print(f"❌ Failed to create preset: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error creating preset: {e}")

def update_preset_to_unsigned():
    """Update existing preset to be unsigned"""
    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/upload_presets/{PRESET_NAME}"
    
    data = {
        "unsigned": True,
        "folder": "jira/workspaces",
    }
    
    try:
        response = requests.put(url, auth=(API_KEY, API_SECRET), json=data)
        
        if response.status_code == 200:
            print(f"✅ Successfully updated preset '{PRESET_NAME}' to unsigned!")
        else:
            print(f"❌ Failed to update preset: {response.status_code}")
            print(response.text)
            print("\n💡 Manual fix required:")
            print("   1. Go to: https://cloudinary.com/console/settings/upload")
            print(f"   2. Find preset '{PRESET_NAME}'")
            print("   3. Set 'Signing Mode' to 'Unsigned'")
            print("   4. Set folder to 'jira/workspaces'")
            print("   5. Save changes")
    except Exception as e:
        print(f"❌ Error updating preset: {e}")

if __name__ == "__main__":
    if not all([CLOUD_NAME, API_KEY, API_SECRET]):
        print("❌ Missing Cloudinary credentials in .env file!")
        print("   Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET")
    else:
        check_and_fix_preset()
        print("\n" + "=" * 60)
        print("Setup complete!")
        print("=" * 60)
