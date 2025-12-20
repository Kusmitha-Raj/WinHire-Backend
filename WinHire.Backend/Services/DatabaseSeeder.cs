using WinHire.Backend.Data;
using WinHire.Backend.Models;

namespace WinHire.Backend.Services;

public class DatabaseSeeder
{
    private readonly AppDbContext _context;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(AppDbContext context, ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        if (_context.Users.Any() && _context.Users.Count() > 1)
        {
            _logger.LogInformation("Database already seeded");
            return;
        }

        _logger.LogInformation("Starting database seeding...");

        await SeedUsersAsync();
        await SeedJobsAsync();
        await SeedCandidatesAsync();
        await SeedApplicationsAsync();
        await SeedInterviewsAsync();
        await SeedFeedbackAsync();

        await _context.SaveChangesAsync();
        _logger.LogInformation("Database seeding completed!");
    }

    private async Task SeedUsersAsync()
    {
        if (_context.Users.Count() > 1) return;

        var users = new[]
        {
            new User
            {
                Name = "Sarah Johnson",
                Email = "sarah.johnson@winhire.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("recruiter123"),
                Role = UserRoles.Recruiter,
                Department = "HR",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            },
            new User
            {
                Name = "Michael Chen",
                Email = "michael.chen@winhire.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("manager123"),
                Role = UserRoles.HiringManager,
                Department = "Engineering",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-5)
            },
            new User
            {
                Name = "Emily Rodriguez",
                Email = "emily.rodriguez@winhire.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("panelist123"),
                Role = UserRoles.Panelist,
                Department = "Engineering",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-4)
            },
            new User
            {
                Name = "David Kim",
                Email = "david.kim@winhire.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("panelist123"),
                Role = UserRoles.Panelist,
                Department = "Product",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            },
            new User
            {
                Name = "Lisa Anderson",
                Email = "lisa.anderson@winhire.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("recruiter123"),
                Role = UserRoles.Recruiter,
                Department = "HR",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-2)
            },
            new User
            {
                Name = "James Wilson",
                Email = "james.wilson@winhire.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("manager123"),
                Role = UserRoles.HiringManager,
                Department = "Product",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-1)
            }
        };

        await _context.Users.AddRangeAsync(users);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} users", users.Length);
    }

    private async Task SeedJobsAsync()
    {
        if (_context.Jobs.Any()) return;

        var hiringManagers = _context.Users.Where(u => u.Role == UserRoles.HiringManager).ToList();

        var jobs = new[]
        {
            new Job
            {
                Title = "Senior Full Stack Developer",
                Description = "We are looking for an experienced Full Stack Developer to join our engineering team. You will work on building scalable web applications using modern technologies.",
                Department = "Engineering",
                Location = "Remote",
                MinExperience = 5,
                MaxExperience = 10,
                RequiredSkills = "C#, .NET Core, React, TypeScript, SQL, Azure",
                MinSalary = 100000,
                MaxSalary = 150000,
                EmploymentType = "Full-Time",
                Status = "Open",
                HiringManagerId = hiringManagers[0].Id,
                PostedDate = DateTime.UtcNow.AddDays(-30),
                OpenPositions = 2
            },
            new Job
            {
                Title = "Frontend Developer",
                Description = "Join our team to build beautiful and responsive user interfaces. Experience with React and modern CSS frameworks required.",
                Department = "Engineering",
                Location = "New York, NY",
                MinExperience = 2,
                MaxExperience = 5,
                RequiredSkills = "React, JavaScript, TypeScript, HTML5, CSS3, Tailwind",
                MinSalary = 70000,
                MaxSalary = 100000,
                EmploymentType = "Full-Time",
                Status = "Open",
                HiringManagerId = hiringManagers[0].Id,
                PostedDate = DateTime.UtcNow.AddDays(-25),
                OpenPositions = 3
            },
            new Job
            {
                Title = "DevOps Engineer",
                Description = "We need a DevOps engineer to help us build and maintain our cloud infrastructure and CI/CD pipelines.",
                Department = "Engineering",
                Location = "San Francisco, CA",
                MinExperience = 3,
                MaxExperience = 7,
                RequiredSkills = "Docker, Kubernetes, AWS, Terraform, Jenkins, Python",
                MinSalary = 90000,
                MaxSalary = 130000,
                EmploymentType = "Full-Time",
                Status = "Open",
                HiringManagerId = hiringManagers[0].Id,
                PostedDate = DateTime.UtcNow.AddDays(-20),
                OpenPositions = 1
            },
            new Job
            {
                Title = "Product Manager",
                Description = "Lead product development and strategy for our flagship products. Work with engineering, design, and business teams.",
                Department = "Product",
                Location = "Austin, TX",
                MinExperience = 4,
                MaxExperience = 8,
                RequiredSkills = "Product Strategy, Agile, User Research, Analytics, Roadmapping",
                MinSalary = 110000,
                MaxSalary = 160000,
                EmploymentType = "Full-Time",
                Status = "Open",
                HiringManagerId = hiringManagers[1].Id,
                PostedDate = DateTime.UtcNow.AddDays(-15),
                OpenPositions = 1
            },
            new Job
            {
                Title = "Junior Software Engineer",
                Description = "Entry-level position for new graduates. Learn from senior engineers and contribute to real projects.",
                Department = "Engineering",
                Location = "Remote",
                MinExperience = 0,
                MaxExperience = 2,
                RequiredSkills = "Java or C# or Python, Git, SQL, Problem Solving",
                MinSalary = 60000,
                MaxSalary = 80000,
                EmploymentType = "Full-Time",
                Status = "Open",
                HiringManagerId = hiringManagers[0].Id,
                PostedDate = DateTime.UtcNow.AddDays(-10),
                OpenPositions = 5
            },
            new Job
            {
                Title = "Data Scientist",
                Description = "Analyze data and build machine learning models to drive business insights.",
                Department = "Engineering",
                Location = "Seattle, WA",
                MinExperience = 3,
                MaxExperience = 6,
                RequiredSkills = "Python, Machine Learning, SQL, Statistics, TensorFlow, PyTorch",
                MinSalary = 95000,
                MaxSalary = 140000,
                EmploymentType = "Full-Time",
                Status = "Open",
                HiringManagerId = hiringManagers[0].Id,
                PostedDate = DateTime.UtcNow.AddDays(-5),
                OpenPositions = 2
            },
            new Job
            {
                Title = "QA Engineer",
                Description = "Ensure quality of our software through manual and automated testing.",
                Department = "Engineering",
                Location = "Boston, MA",
                MinExperience = 2,
                MaxExperience = 5,
                RequiredSkills = "Selenium, Jest, Cypress, API Testing, Test Automation",
                MinSalary = 65000,
                MaxSalary = 95000,
                EmploymentType = "Full-Time",
                Status = "Closed",
                HiringManagerId = hiringManagers[0].Id,
                PostedDate = DateTime.UtcNow.AddDays(-60),
                ClosingDate = DateTime.UtcNow.AddDays(-10),
                OpenPositions = 0
            }
        };

        await _context.Jobs.AddRangeAsync(jobs);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} jobs", jobs.Length);
    }

    private async Task SeedCandidatesAsync()
    {
        if (_context.Candidates.Any()) return;

        var candidates = new[]
        {
            new Candidate
            {
                Name = "Alice Thompson",
                Email = "alice.thompson@email.com",
                Phone = "+1-555-0101",
                RoleApplied = "Senior Full Stack Developer",
                YearsOfExperience = 7,
                Skills = "C#, .NET Core, React, TypeScript, Azure, SQL Server",
                Status = "Interview Scheduled",
                AppliedDate = DateTime.UtcNow.AddDays(-25)
            },
            new Candidate
            {
                Name = "Robert Martinez",
                Email = "robert.martinez@email.com",
                Phone = "+1-555-0102",
                RoleApplied = "Frontend Developer",
                YearsOfExperience = 3,
                Skills = "React, JavaScript, HTML5, CSS3, Tailwind, Redux",
                Status = "Under Review",
                AppliedDate = DateTime.UtcNow.AddDays(-20)
            },
            new Candidate
            {
                Name = "Jennifer Lee",
                Email = "jennifer.lee@email.com",
                Phone = "+1-555-0103",
                RoleApplied = "DevOps Engineer",
                YearsOfExperience = 5,
                Skills = "Docker, Kubernetes, AWS, Jenkins, Python, Terraform",
                Status = "Shortlisted",
                AppliedDate = DateTime.UtcNow.AddDays(-18)
            },
            new Candidate
            {
                Name = "William Brown",
                Email = "william.brown@email.com",
                Phone = "+1-555-0104",
                RoleApplied = "Product Manager",
                YearsOfExperience = 6,
                Skills = "Product Strategy, Agile, JIRA, User Research, Analytics",
                Status = "Application Received",
                AppliedDate = DateTime.UtcNow.AddDays(-15)
            },
            new Candidate
            {
                Name = "Sophia Patel",
                Email = "sophia.patel@email.com",
                Phone = "+1-555-0105",
                RoleApplied = "Junior Software Engineer",
                YearsOfExperience = 1,
                Skills = "Java, Spring Boot, MySQL, Git, REST APIs",
                Status = "Offered",
                AppliedDate = DateTime.UtcNow.AddDays(-12)
            },
            new Candidate
            {
                Name = "Daniel Garcia",
                Email = "daniel.garcia@email.com",
                Phone = "+1-555-0106",
                RoleApplied = "Data Scientist",
                YearsOfExperience = 4,
                Skills = "Python, TensorFlow, Pandas, SQL, Machine Learning",
                Status = "Interview Scheduled",
                AppliedDate = DateTime.UtcNow.AddDays(-10)
            },
            new Candidate
            {
                Name = "Olivia Taylor",
                Email = "olivia.taylor@email.com",
                Phone = "+1-555-0107",
                RoleApplied = "Senior Full Stack Developer",
                YearsOfExperience = 8,
                Skills = "C#, ASP.NET, Angular, Azure, Microservices",
                Status = "Hired",
                AppliedDate = DateTime.UtcNow.AddDays(-45)
            },
            new Candidate
            {
                Name = "Ethan White",
                Email = "ethan.white@email.com",
                Phone = "+1-555-0108",
                RoleApplied = "Frontend Developer",
                YearsOfExperience = 2,
                Skills = "Vue.js, JavaScript, Webpack, SASS, Git",
                Status = "Rejected",
                AppliedDate = DateTime.UtcNow.AddDays(-8)
            },
            new Candidate
            {
                Name = "Ava Harris",
                Email = "ava.harris@email.com",
                Phone = "+1-555-0109",
                RoleApplied = "DevOps Engineer",
                YearsOfExperience = 3,
                Skills = "Docker, AWS, CircleCI, Bash, Monitoring",
                Status = "Application Received",
                AppliedDate = DateTime.UtcNow.AddDays(-5)
            },
            new Candidate
            {
                Name = "Noah Clark",
                Email = "noah.clark@email.com",
                Phone = "+1-555-0110",
                RoleApplied = "Junior Software Engineer",
                YearsOfExperience = 0,
                Skills = "Python, Django, PostgreSQL, Git",
                Status = "Under Review",
                AppliedDate = DateTime.UtcNow.AddDays(-3)
            },
            new Candidate
            {
                Name = "Isabella Lewis",
                Email = "isabella.lewis@email.com",
                Phone = "+1-555-0111",
                RoleApplied = "Data Scientist",
                YearsOfExperience = 5,
                Skills = "Python, PyTorch, Deep Learning, Statistics, R",
                Status = "Shortlisted",
                AppliedDate = DateTime.UtcNow.AddDays(-7)
            },
            new Candidate
            {
                Name = "Mason Walker",
                Email = "mason.walker@email.com",
                Phone = "+1-555-0112",
                RoleApplied = "Product Manager",
                YearsOfExperience = 5,
                Skills = "Product Development, Scrum, A/B Testing, SQL",
                Status = "Interview Scheduled",
                AppliedDate = DateTime.UtcNow.AddDays(-14)
            }
        };

        await _context.Candidates.AddRangeAsync(candidates);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} candidates", candidates.Length);
    }

    private async Task SeedApplicationsAsync()
    {
        if (_context.Applications.Any()) return;

        var jobs = _context.Jobs.ToList();
        var candidates = _context.Candidates.ToList();
        var recruiters = _context.Users.Where(u => u.Role == UserRoles.Recruiter).ToList();

        var applications = new[]
        {
            new Application
            {
                CandidateId = candidates[0].Id,
                JobId = jobs[0].Id,
                Status = "Interview",
                AppliedDate = DateTime.UtcNow.AddDays(-25),
                RecruterId = recruiters[0].Id,
                ResumeUrl = "https://example.com/resumes/alice_thompson.pdf",
                Notes = "Strong technical background, matches all requirements"
            },
            new Application
            {
                CandidateId = candidates[1].Id,
                JobId = jobs[1].Id,
                Status = "Screening",
                AppliedDate = DateTime.UtcNow.AddDays(-20),
                RecruterId = recruiters[0].Id,
                ResumeUrl = "https://example.com/resumes/robert_martinez.pdf",
                Notes = "Good portfolio, needs skills assessment"
            },
            new Application
            {
                CandidateId = candidates[2].Id,
                JobId = jobs[2].Id,
                Status = "Interview",
                AppliedDate = DateTime.UtcNow.AddDays(-18),
                RecruterId = recruiters[1].Id,
                ResumeUrl = "https://example.com/resumes/jennifer_lee.pdf",
                Notes = "Excellent DevOps experience"
            },
            new Application
            {
                CandidateId = candidates[3].Id,
                JobId = jobs[3].Id,
                Status = "Applied",
                AppliedDate = DateTime.UtcNow.AddDays(-15),
                RecruterId = recruiters[0].Id,
                ResumeUrl = "https://example.com/resumes/william_brown.pdf"
            },
            new Application
            {
                CandidateId = candidates[4].Id,
                JobId = jobs[4].Id,
                Status = "Offered",
                AppliedDate = DateTime.UtcNow.AddDays(-12),
                RecruterId = recruiters[1].Id,
                ResumeUrl = "https://example.com/resumes/sophia_patel.pdf",
                Notes = "Great fit for junior role, offer extended"
            },
            new Application
            {
                CandidateId = candidates[5].Id,
                JobId = jobs[5].Id,
                Status = "Interview",
                AppliedDate = DateTime.UtcNow.AddDays(-10),
                RecruterId = recruiters[0].Id,
                ResumeUrl = "https://example.com/resumes/daniel_garcia.pdf",
                Notes = "Strong ML background"
            },
            new Application
            {
                CandidateId = candidates[6].Id,
                JobId = jobs[0].Id,
                Status = "Accepted",
                AppliedDate = DateTime.UtcNow.AddDays(-45),
                RecruterId = recruiters[0].Id,
                ResumeUrl = "https://example.com/resumes/olivia_taylor.pdf",
                Notes = "Hired! Starts next month"
            },
            new Application
            {
                CandidateId = candidates[7].Id,
                JobId = jobs[1].Id,
                Status = "Rejected",
                AppliedDate = DateTime.UtcNow.AddDays(-8),
                RecruterId = recruiters[1].Id,
                ResumeUrl = "https://example.com/resumes/ethan_white.pdf",
                Notes = "Not enough experience with React"
            },
            new Application
            {
                CandidateId = candidates[8].Id,
                JobId = jobs[2].Id,
                Status = "Applied",
                AppliedDate = DateTime.UtcNow.AddDays(-5),
                RecruterId = recruiters[0].Id,
                ResumeUrl = "https://example.com/resumes/ava_harris.pdf"
            },
            new Application
            {
                CandidateId = candidates[9].Id,
                JobId = jobs[4].Id,
                Status = "Screening",
                AppliedDate = DateTime.UtcNow.AddDays(-3),
                RecruterId = recruiters[1].Id,
                ResumeUrl = "https://example.com/resumes/noah_clark.pdf",
                Notes = "New graduate, evaluating potential"
            },
            new Application
            {
                CandidateId = candidates[10].Id,
                JobId = jobs[5].Id,
                Status = "Interview",
                AppliedDate = DateTime.UtcNow.AddDays(-7),
                RecruterId = recruiters[0].Id,
                ResumeUrl = "https://example.com/resumes/isabella_lewis.pdf",
                Notes = "PhD in ML, very promising"
            },
            new Application
            {
                CandidateId = candidates[11].Id,
                JobId = jobs[3].Id,
                Status = "Interview",
                AppliedDate = DateTime.UtcNow.AddDays(-14),
                RecruterId = recruiters[1].Id,
                ResumeUrl = "https://example.com/resumes/mason_walker.pdf",
                Notes = "Good product experience"
            }
        };

        await _context.Applications.AddRangeAsync(applications);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} applications", applications.Length);
    }

    private async Task SeedInterviewsAsync()
    {
        if (_context.Interviews.Any()) return;

        var applications = _context.Applications.Where(a => a.Status == "Interview" || a.Status == "Offered" || a.Status == "Accepted").ToList();
        var panelists = _context.Users.Where(u => u.Role == UserRoles.Panelist).ToList();

        if (!applications.Any() || !panelists.Any())
        {
            _logger.LogWarning("Cannot seed interviews: No applications or panelists found");
            return;
        }

        var interviews = new List<Interview>();
        
        for (int i = 0; i < Math.Min(applications.Count, 8); i++)
        {
            var app = applications[i];
            var interviewer = panelists[i % panelists.Count];
            
            interviews.Add(new Interview
            {
                ApplicationId = app.Id,
                Title = $"Technical Round {i + 1}",
                Type = i % 2 == 0 ? "Technical" : "HR",
                ScheduledDateTime = DateTime.UtcNow.AddDays(i - 2).AddHours(10 + i),
                DurationMinutes = 60,
                MeetingLink = $"https://meet.google.com/abc-{i:D4}",
                Status = i < 3 ? "Completed" : "Scheduled",
                InterviewerId = interviewer.Id,
                Notes = $"Interview for {app.Candidate?.Name}",
                CompletedAt = i < 3 ? DateTime.UtcNow.AddDays(i - 2).AddHours(11 + i) : null
            });
        }

        await _context.Interviews.AddRangeAsync(interviews);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} interviews", interviews.Count);
    }

    private async Task SeedFeedbackAsync()
    {
        if (_context.Feedbacks.Any()) return;

        var completedInterviews = _context.Interviews.Where(i => i.Status == "Completed").ToList();
        var panelists = _context.Users.Where(u => u.Role == UserRoles.Panelist).ToList();

        if (!completedInterviews.Any() || !panelists.Any())
        {
            _logger.LogWarning("Cannot seed feedback: No completed interviews or panelists found");
            return;
        }

        var feedbacks = new List<Feedback>();
        for (int i = 0; i < Math.Min(completedInterviews.Count, 5); i++)
        {
            var interview = completedInterviews[i];
            var panelist = panelists[i % panelists.Count];
            
            feedbacks.Add(new Feedback
            {
                InterviewId = interview.Id,
                ApplicationId = interview.ApplicationId,
                ProvidedByUserId = panelist.Id,
                TechnicalSkillsRating = 3 + (i % 3),
                CommunicationRating = 4 + (i % 2),
                ProblemSolvingRating = 3 + (i % 3),
                CulturalFitRating = 4 + (i % 2),
                OverallRating = 4 + (i % 2),
                Comments = $"Feedback for interview: {interview.Title}. Good technical skills and communication.",
                Recommendation = i % 2 == 0 ? "Hire" : "StrongHire",
                CreatedAt = DateTime.UtcNow.AddDays(-i)
            });
        }

        await _context.Feedbacks.AddRangeAsync(feedbacks);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} feedbacks", feedbacks.Count);
    }
}
