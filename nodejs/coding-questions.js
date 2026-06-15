// 1. Flatten objects
/*
input:
 {
    user: {
        name: "Avinash",
        address: {
            city: "Bangalore",
            location: {
                lat: 12.97,
                lng: 77.59
            }
        }
    },
    job: {
        title: "Software Engineer",
        company: {
            name: "Koch",
            details: {
                type: "Private",
                size: 10000
            }
        }
    }
};

output: 
{
  "user.name": "Avinash",
  "user.address.city": "Bangalore",
  "user.address.location.lat": 12.97,
  "user.address.location.lng": 77.59,
  "job.title": "Software Engineer",
  "job.company.name": "Koch",
  "job.company.details.type": "Private",
  "job.company.details.size": 10000
}
*/

// Recursive Solution

function flattenObject(obj, parentKey = "", result = {}) {
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] != null && !Array.isArray(obj[key])) {
            flattenObject(obj[key], newKey, result);
        } else {
            result[newKey] = obj[key];
        }
    }
    return result;
}

const input = {
    user: {
        name: "Avinash",
        address: {
            city: "Bangalore",
            location: {
                lat: 12.97,
                lng: 77.59
            }
        }
    },
    job: {
        title: "Software Engineer",
        company: {
            name: "Koch",
            details: {
                type: "Private",
                size: 10000
            }
        }
    }
};

const response = flattenObject(input);
console.log('response::', response);

// Iterative Solution

function flattenObjectIterative(obj) {
    const result = {};
    const stack = [{ current: obj, parentKey: "" }];

    while (stack.length > 0) {
        const { current, parentKey } = stack.pop();
        for (let key in current) {
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            if (typeof current[key] === "object" && current[key] != null && !Array.isArray(current[key])) {
                stack.push({
                    current: current[key],
                    parentKey: newKey
                })
            } else {
                result[newKey] = current[key];
            }
        }
    }
    return result;
}

const inputObj = {
    user: {
        name: "Avinash",
        address: {
            city: "Bangalore",
            location: {
                lat: 12.97,
                lng: 77.59
            }
        }
    },
    job: {
        title: "Software Engineer",
        company: {
            name: "Koch",
            details: {
                type: "Private",
                size: 10000
            }
        }
    }
};

const result = flattenObjectIterative(inputObj);
console.log('result::', result);

