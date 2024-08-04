# Robot Pantry Tracker 🤖

## Introduction

Robot Pantry Tracker is a web application designed to help you manage your pantry inventory efficiently. Inspired by Walmart's retail robots and inventory management systems, this app brings the power of automated inventory tracking to your home pantry.

## Features

1. **Image Recognition**: Using an OpenAI CLIP model via a FastAPI endpoint, the app can recognize pantry items from photos.

2. **Add Items**:
   - Manually enter item names
   - Use your device's camera to capture and identify items automatically

3. **Inventory Management**:
   - View all pantry items in a list
   - Update item quantities easily
   - Remove items when depleted

4. **User-Friendly Interface**:
   - Clean, responsive design
   - Easy-to-use controls for managing your pantry

## How It Works

1. **Adding Items**:
   - Click the "Add Item" button
   - Either type in the item name or use the camera feature
   - If using the camera, the app will attempt to identify the item automatically

2. **Camera Feature**:
   - Captures a photo of your pantry item
   - Crops and resizes the image for optimal recognition
   - Sends the image to a FastAPI endpoint using the OpenAI CLIP model for identification

3. **Inventory Updates**:
   - Use the quantity controls to adjust item counts
   - Delete items directly from the list when no longer needed

## Technology Stack

### Frontend
- Framework: Next.js with React
- UI Components: Material-UI

### Backend
- API Framework: FastAPI
- Image Recognition: OpenAI CLIP model
- Database: Firebase Firestore

### Deployment
- Frontend: Vercel
- Backend API: AWS ECS (Elastic Container Service)
- Load Balancing: AWS Application Load Balancer
- Containerization: Docker

The FastAPI endpoint for image recognition is available at [https://github.com/andrewangbl/clip-fastapi](https://github.com/andrewangbl/clip-fastapi).

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your Firebase configuration
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Future Enhancements

- Barcode scanning for quicker item addition
- Meal planning suggestions based on pantry inventory
- Expiration date tracking and notifications

Contributions to improve and expand the Robot Pantry Tracker are welcome!
