import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Survey from '@/app/models/survey';
import dbConnect from '@/app/lib/dbConnect';
import mongoose from 'mongoose';

async function getUserFromHeaders() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const userEmail = headersList.get('x-user-email');
  const userName = headersList.get('x-user-name');

  if (!userId || !userEmail || !userName) {
    return null;
  }

  return { userId, email: userEmail, name: userName };
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const user = await getUserFromHeaders();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, questions } = await req.json();

    // Convert userId string to ObjectId
    const ownerId = new mongoose.Types.ObjectId(user.userId);
    console.log('Creating survey with owner ID:', ownerId.toString());

    const survey = await Survey.create({
      title,
      description,
      questions,
      owner: ownerId
    });

    return NextResponse.json(survey, { status: 201 });
  } catch (error: any) {
    console.error('Survey creation error:', error);
    return NextResponse.json(
      { message: error.message || 'Error creating survey' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    const user = await getUserFromHeaders();
    const { searchParams } = new URL(req.url);
    const surveyId = searchParams.get('id');

    if (surveyId) {
      // Get specific survey
      const survey = await Survey.findById(surveyId);
      
      if (!survey) {
        return NextResponse.json(
          { message: 'Survey not found' },
          { status: 404 }
        );
      }

      // Return public survey data
      const publicSurvey = {
        title: survey.title,
        description: survey.description,
        questions: survey.questions,
        _id: survey._id,
        createdAt: survey.createdAt
      };
      return NextResponse.json(publicSurvey);
    } else {
      // Get all surveys
      const surveys = await Survey.find({}).select('title description createdAt');
      return NextResponse.json(surveys);
    }
  } catch (error: any) {
    console.error('Survey fetch error:', error);
    return NextResponse.json(
      { message: 'Error fetching surveys' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const user = await getUserFromHeaders();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const surveyId = searchParams.get('id');

    if (!surveyId) {
      return NextResponse.json(
        { message: 'Survey ID is required' },
        { status: 400 }
      );
    }

    const survey = await Survey.findById(surveyId);
    
    if (!survey) {
      return NextResponse.json(
        { message: 'Survey not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (survey.owner.toString() !== user.userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await survey.deleteOne();
    return NextResponse.json({ message: 'Survey deleted successfully' });
  } catch (error: any) {
    console.error('Survey deletion error:', error);
    return NextResponse.json(
      { message: 'Error deleting survey' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();

    const user = await getUserFromHeaders();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const surveyId = searchParams.get('id');

    if (!surveyId) {
      return NextResponse.json(
        { message: 'Survey ID is required' },
        { status: 400 }
      );
    }

    const survey = await Survey.findById(surveyId);
    
    if (!survey) {
      return NextResponse.json(
        { message: 'Survey not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (survey.owner.toString() !== user.userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updates = await req.json();
    const updatedSurvey = await Survey.findByIdAndUpdate(
      surveyId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    return NextResponse.json(updatedSurvey);
  } catch (error: any) {
    console.error('Survey update error:', error);
    return NextResponse.json(
      { message: 'Error updating survey' },
      { status: 500 }
    );
  }
} 